package com.sed10.mln.study.service;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.sed10.mln.study.dto.response.SubjectDocumentResponse;
import com.sed10.mln.study.entity.Subject;
import com.sed10.mln.study.entity.SubjectDocument;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.repository.SubjectDocumentRepository;
import com.sed10.mln.study.repository.SubjectRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectDocumentService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "zip",
            "png", "jpg", "jpeg", "webp");

    SubjectDocumentRepository subjectDocumentRepository;
    SubjectRepository subjectRepository;
    FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<SubjectDocumentResponse> listAll() {
        return subjectDocumentRepository.findAllWithSubject().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SubjectDocumentResponse> listBySubject(Long subjectId) {
        ensureSubjectExists(subjectId);
        return subjectDocumentRepository.findBySubjectIdWithSubject(subjectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public SubjectDocumentResponse upload(Long subjectId, String title, MultipartFile file) {
        validateTitle(title);
        validateFile(file);

        Subject subject = ensureSubjectExists(subjectId);
        String originalFilename = file.getOriginalFilename();
        String extension = fileStorageService.getExtension(originalFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new AppException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }

        SubjectDocument document = SubjectDocument.builder()
                .subject(subject)
                .title(title.trim())
                .resourceUrl("pending")
                .originalFilename(originalFilename)
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .build();

        document = subjectDocumentRepository.save(document);

        try {
            byte[] bytes = file.getBytes();
            String resourceUrl = fileStorageService.storeSubjectDocument(
                    document.getId(), originalFilename, bytes);
            document.setResourceUrl(resourceUrl);
            document = subjectDocumentRepository.save(document);
            return toResponse(document);
        } catch (RuntimeException exception) {
            fileStorageService.deleteSubjectDocumentFiles(document.getId());
            subjectDocumentRepository.delete(document);
            throw exception;
        } catch (Exception exception) {
            fileStorageService.deleteSubjectDocumentFiles(document.getId());
            subjectDocumentRepository.delete(document);
            log.error("Failed to upload subject document for subject {}", subjectId, exception);
            throw new AppException(ErrorCode.CLOUDINARY_UPLOAD_FAILED);
        }
    }

    public void delete(Long documentId) {
        SubjectDocument document = subjectDocumentRepository.findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_DOCUMENT_NOT_FOUND));

        fileStorageService.deleteSubjectDocumentFiles(documentId);
        subjectDocumentRepository.delete(document);
    }

    private Subject ensureSubjectExists(Long subjectId) {
        return subjectRepository.findById(subjectId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
    }

    private void validateTitle(String title) {
        if (!StringUtils.hasText(title)) {
            throw new AppException(ErrorCode.TITLE_REQUIRED);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE_UPLOAD);
        }
    }

    private SubjectDocumentResponse toResponse(SubjectDocument document) {
        Subject subject = document.getSubject();
        String originalFilename = document.getOriginalFilename();
        String extension = StringUtils.hasText(originalFilename)
                ? fileStorageService.getExtension(originalFilename)
                : null;

        return SubjectDocumentResponse.builder()
                .documentId(document.getId())
                .subjectId(subject != null ? subject.getId() : null)
                .subjectTitle(subject != null ? subject.getTitle() : null)
                .title(document.getTitle())
                .resourceUrl(document.getResourceUrl())
                .originalFilename(originalFilename)
                .fileExtension(extension != null ? extension.toUpperCase(Locale.ROOT) : null)
                .fileSize(document.getFileSize())
                .createdAt(document.getCreatedAt())
                .build();
    }
}
