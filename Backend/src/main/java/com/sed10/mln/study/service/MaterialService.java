package com.sed10.mln.study.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.sed10.mln.study.dto.request.MaterialRequest;
import com.sed10.mln.study.dto.response.MaterialDetailResponse;
import com.sed10.mln.study.dto.response.MaterialResponse;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.entity.Material;
import com.sed10.mln.study.entity.Slide;
import com.sed10.mln.study.enums.ContentType;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.mapper.MaterialMapper;
import com.sed10.mln.study.repository.LessonRepository;
import com.sed10.mln.study.repository.MaterialRepository;
import com.sed10.mln.study.repository.SlideRepository;
import com.sed10.mln.study.service.SlideProcessorService.ProcessedSlides;
import com.sed10.mln.study.service.SlideProcessorService.StoredSlide;
import com.sed10.mln.study.utils.YoutubeUrlUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MaterialService {

    final MaterialRepository materialRepo;
    final MaterialMapper materialMap;
    final LessonRepository lessonRepo;
    final SlideRepository slideRepo;
    final SlideProcessorService slideProcessorService;
    final FileStorageService fileStorageService;

    /**
     * Tạo material: bắt buộc có slide files HOẶC link YouTube (không được thiếu cả hai, không gửi cả hai).
     */
    public MaterialDetailResponse createMaterial(
            Long lessonId,
            String title,
            MultipartFile[] files,
            String youtubeUrl) {

        validateTitle(title);
        validateContentInput(files, youtubeUrl);

        Lesson lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        checkLessonOwnership(lesson);

        if (hasYoutubeUrl(youtubeUrl)) {
            return createYoutubeMaterial(lesson, title, youtubeUrl);
        }

        return createSlideDeckMaterial(lesson, title, files);
    }

    public MaterialDetailResponse replaceSlideDeck(Long materialId, String title, MultipartFile[] files) {
        Material material = materialRepo.findById(materialId)
                .orElseThrow(() -> new AppException(ErrorCode.MATERIAL_NOT_FOUND));

        checkLessonOwnership(material.getLesson());

        if (!ContentType.SLIDE_DECK.name().equals(material.getContentType())) {
            throw new AppException(ErrorCode.MATERIAL_CONTENT_CONFLICT);
        }

        if (files == null || files.length == 0) {
            throw new AppException(ErrorCode.INVALID_FILE_UPLOAD);
        }

        fileStorageService.deleteMaterialFiles(materialId);
        slideRepo.deleteByMaterialId(materialId);
        material.getSlides().clear();

        if (StringUtils.hasText(title)) {
            material.setTitle(title.trim());
        }

        ProcessedSlides processedSlides = slideProcessorService.processUpload(materialId, files);
        persistSlides(material, processedSlides);
        material.setSlideCount(processedSlides.slides().size());
        material.setResourceUrl(processedSlides.originalResourceUrl());
        materialRepo.save(material);

        return getMaterialDetail(materialId);
    }

    @Transactional(readOnly = true)
    public MaterialDetailResponse getMaterialDetail(Long materialId) {
        Material material = materialRepo.findByIdWithSlides(materialId)
                .orElseThrow(() -> new AppException(ErrorCode.MATERIAL_NOT_FOUND));
        return enrichDetailResponse(materialMap.toMaterialDetailResponse(material));
    }

    public void deleteMaterial(Long materialId) {
        Material material = materialRepo.findById(materialId)
                .orElseThrow(() -> new AppException(ErrorCode.MATERIAL_NOT_FOUND));

        checkLessonOwnership(material.getLesson());

        if (ContentType.SLIDE_DECK.name().equals(material.getContentType())) {
            fileStorageService.deleteMaterialFiles(materialId);
        }

        materialRepo.delete(material);
    }

    public void updateMaterial(Long materialId, MaterialRequest materialRequest) {
        Material material = materialRepo.findById(materialId)
                .orElseThrow(() -> new AppException(ErrorCode.MATERIAL_NOT_FOUND));

        checkLessonOwnership(material.getLesson());

        if (StringUtils.hasText(materialRequest.getTitle())) {
            material.setTitle(materialRequest.getTitle().trim());
        }

        if (StringUtils.hasText(materialRequest.getYoutubeUrl())) {
            if (!ContentType.YOUTUBE.name().equals(material.getContentType())) {
                throw new AppException(ErrorCode.MATERIAL_CONTENT_CONFLICT);
            }
            material.setResourceUrl(normalizeYoutubeUrl(materialRequest.getYoutubeUrl()));
        }

        materialRepo.save(material);
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> listMaterialByLessonId(Long lessonId) {
        lessonRepo.findById(lessonId).orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
        List<Material> materials = materialRepo.findByLessonId(lessonId);
        return materials.stream().map(this::toMaterialResponseWithPreview).toList();
    }

    @Transactional(readOnly = true)
    public MaterialResponse toMaterialResponseWithPreview(Material material) {
        MaterialResponse response = materialMap.toMaterialResponse(material);
        response.setPreviewImageUrl(resolvePreviewImageUrl(material));
        return response;
    }

    @Transactional(readOnly = true)
    public String resolvePreviewImageUrl(Material material) {
        if (ContentType.YOUTUBE.name().equals(material.getContentType())) {
            return YoutubeUrlUtil.extractVideoId(material.getResourceUrl())
                    .map(videoId -> "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg")
                    .orElse(null);
        }

        return slideRepo.findFirstByMaterialIdOrderBySlideIndexAsc(material.getId())
                .map(Slide::getImageUrl)
                .orElse(null);
    }

    private MaterialDetailResponse createYoutubeMaterial(Lesson lesson, String title, String youtubeUrl) {
        String normalizedUrl = normalizeYoutubeUrl(youtubeUrl);

        Material material = Material.builder()
                .lesson(lesson)
                .title(title.trim())
                .contentType(ContentType.YOUTUBE.name())
                .resourceUrl(normalizedUrl)
                .slideCount(null)
                .slides(new ArrayList<>())
                .build();

        material = materialRepo.save(material);
        return getMaterialDetail(material.getId());
    }

    private MaterialDetailResponse createSlideDeckMaterial(Lesson lesson, String title, MultipartFile[] files) {
        Material material = Material.builder()
                .lesson(lesson)
                .title(title.trim())
                .contentType(ContentType.SLIDE_DECK.name())
                .slideCount(0)
                .slides(new ArrayList<>())
                .build();

        material = materialRepo.save(material);

        try {
            ProcessedSlides processedSlides = slideProcessorService.processUpload(material.getId(), files);
            persistSlides(material, processedSlides);
            material.setSlideCount(processedSlides.slides().size());
            material.setResourceUrl(processedSlides.originalResourceUrl());
            material = materialRepo.save(material);
            return getMaterialDetail(material.getId());
        } catch (RuntimeException exception) {
            fileStorageService.deleteMaterialFiles(material.getId());
            materialRepo.delete(material);
            throw exception;
        }
    }

    private void persistSlides(Material material, ProcessedSlides processedSlides) {
        for (StoredSlide storedSlide : processedSlides.slides()) {
            Slide slide = Slide.builder()
                    .material(material)
                    .slideIndex(storedSlide.slideIndex())
                    .imageUrl(storedSlide.imageUrl())
                    .build();
            material.getSlides().add(slide);
        }
        slideRepo.saveAll(material.getSlides());
    }

    private MaterialDetailResponse enrichDetailResponse(MaterialDetailResponse response) {
        if (ContentType.YOUTUBE.name().equals(response.getContentType())
                && StringUtils.hasText(response.getResourceUrl())) {
            YoutubeUrlUtil.extractVideoId(response.getResourceUrl()).ifPresent(videoId -> {
                response.setYoutubeVideoId(videoId);
                response.setYoutubeEmbedUrl(YoutubeUrlUtil.toEmbedUrl(videoId));
            });
        }
        return response;
    }

    private void validateTitle(String title) {
        if (!StringUtils.hasText(title)) {
            throw new AppException(ErrorCode.TITLE_REQUIRED);
        }
    }

    private void validateContentInput(MultipartFile[] files, String youtubeUrl) {
        boolean hasFiles = files != null && files.length > 0;
        boolean hasYoutube = hasYoutubeUrl(youtubeUrl);

        if (!hasFiles && !hasYoutube) {
            throw new AppException(ErrorCode.MATERIAL_CONTENT_REQUIRED);
        }

        if (hasFiles && hasYoutube) {
            throw new AppException(ErrorCode.MATERIAL_CONTENT_CONFLICT);
        }
    }

    private boolean hasYoutubeUrl(String youtubeUrl) {
        return StringUtils.hasText(youtubeUrl);
    }

    private String normalizeYoutubeUrl(String youtubeUrl) {
        if (!YoutubeUrlUtil.isValid(youtubeUrl)) {
            throw new AppException(ErrorCode.INVALID_YOUTUBE_URL);
        }
        return YoutubeUrlUtil.normalize(youtubeUrl);
    }

    private void checkLessonOwnership(Lesson lesson) {
        // Ownership check removed: all teachers share resources
    }
}
