package com.sed10.mln.study.service;

import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.function.Predicate;

@Service
@RequiredArgsConstructor
@Slf4j
public class SlideProcessorService {

    private static final Set<String> IMAGE_EXTENSIONS = Set.of("png", "jpg", "jpeg", "webp");
    private static final Set<String> IMAGE_CONTENT_TYPES = Set.of(
            "image/png", "image/jpeg", "image/jpg", "image/webp");
    private static final Set<String> PDF_CONTENT_TYPES = Set.of("application/pdf");
    private static final Set<String> PPTX_CONTENT_TYPES = Set.of(
            "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    private static final Set<String> PPT_CONTENT_TYPES = Set.of("application/vnd.ms-powerpoint");
    private static final float PDF_RENDER_DPI = 150f;

    private final FileStorageService fileStorageService;
    private final PptxConverterService pptxConverterService;

    public ProcessedSlides processUpload(Long materialId, MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new AppException(ErrorCode.INVALID_FILE_UPLOAD);
        }

        if (files.length == 1) {
            MultipartFile file = files[0];
            if (isPdf(file)) {
                return processPdf(materialId, file);
            }
            if (isPptx(file)) {
                return processPptx(materialId, file);
            }
            return processImages(materialId, files);
        }

        if (allMatch(files, this::isPdf)) {
            return processMultiplePdfs(materialId, files);
        }
        if (allMatch(files, this::isPptx)) {
            return processMultiplePptx(materialId, files);
        }
        if (allMatch(files, this::isImage)) {
            return processImages(materialId, files);
        }

        throw new AppException(ErrorCode.UNSUPPORTED_FILE_TYPE);
    }

    private ProcessedSlides processPdf(Long materialId, MultipartFile pdfFile) {
        validatePdf(pdfFile);

        try {
            byte[] pdfBytes = pdfFile.getBytes();
            log.info("Processing PDF for material {}, size={} bytes", materialId, pdfBytes.length);

            String originalUrl = fileStorageService.storeOriginalFile(
                    materialId, pdfFile.getOriginalFilename(), pdfBytes);
            List<StoredSlide> storedSlides = renderPdfToSlides(materialId, pdfBytes, 1);

            if (storedSlides.isEmpty()) {
                throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
            }

            return new ProcessedSlides(storedSlides, originalUrl);
        } catch (AppException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Failed to process PDF for material {}", materialId, exception);
            throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
        }
    }

    private ProcessedSlides processMultiplePdfs(Long materialId, MultipartFile[] files) {
        List<MultipartFile> sortedFiles = sortedCopy(files);
        List<StoredSlide> storedSlides = new ArrayList<>();
        String firstOriginalUrl = null;
        int nextSlideIndex = 1;

        try {
            for (int fileIndex = 0; fileIndex < sortedFiles.size(); fileIndex++) {
                MultipartFile pdfFile = sortedFiles.get(fileIndex);
                validatePdf(pdfFile);

                byte[] pdfBytes = pdfFile.getBytes();
                log.info(
                        "Processing PDF {}/{} for material {}, size={} bytes",
                        fileIndex + 1,
                        sortedFiles.size(),
                        materialId,
                        pdfBytes.length);

                String originalUrl = fileStorageService.storeOriginalFile(
                        materialId, pdfFile.getOriginalFilename(), pdfBytes, fileIndex + 1);
                if (firstOriginalUrl == null) {
                    firstOriginalUrl = originalUrl;
                }

                List<StoredSlide> pdfSlides = renderPdfToSlides(materialId, pdfBytes, nextSlideIndex);
                if (pdfSlides.isEmpty()) {
                    throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
                }

                nextSlideIndex += pdfSlides.size();
                storedSlides.addAll(pdfSlides);
            }
        } catch (AppException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Failed to process multiple PDFs for material {}", materialId, exception);
            throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
        }

        if (storedSlides.isEmpty()) {
            throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
        }

        return new ProcessedSlides(storedSlides, firstOriginalUrl);
    }

    private ProcessedSlides processPptx(Long materialId, MultipartFile pptxFile) {
        validatePptx(pptxFile);

        try {
            byte[] pptxBytes = pptxFile.getBytes();
            String originalUrl = fileStorageService.storeOriginalFile(
                    materialId, pptxFile.getOriginalFilename(), pptxBytes);
            byte[] pdfBytes = pptxConverterService.convertToPdf(pptxFile);
            List<StoredSlide> storedSlides = renderPdfToSlides(materialId, pdfBytes, 1);

            if (storedSlides.isEmpty()) {
                throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
            }

            return new ProcessedSlides(storedSlides, originalUrl);
        } catch (AppException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Failed to process PPTX for material {}", materialId, exception);
            throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
        }
    }

    private ProcessedSlides processMultiplePptx(Long materialId, MultipartFile[] files) {
        List<MultipartFile> sortedFiles = sortedCopy(files);
        List<StoredSlide> storedSlides = new ArrayList<>();
        String firstOriginalUrl = null;
        int nextSlideIndex = 1;

        try {
            for (int fileIndex = 0; fileIndex < sortedFiles.size(); fileIndex++) {
                MultipartFile pptxFile = sortedFiles.get(fileIndex);
                validatePptx(pptxFile);

                byte[] pptxBytes = pptxFile.getBytes();
                String originalUrl = fileStorageService.storeOriginalFile(
                        materialId, pptxFile.getOriginalFilename(), pptxBytes, fileIndex + 1);
                if (firstOriginalUrl == null) {
                    firstOriginalUrl = originalUrl;
                }

                byte[] pdfBytes = pptxConverterService.convertToPdf(pptxFile);
                List<StoredSlide> pptxSlides = renderPdfToSlides(materialId, pdfBytes, nextSlideIndex);
                if (pptxSlides.isEmpty()) {
                    throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
                }

                nextSlideIndex += pptxSlides.size();
                storedSlides.addAll(pptxSlides);
            }
        } catch (AppException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Failed to process multiple PPTX files for material {}", materialId, exception);
            throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
        }

        if (storedSlides.isEmpty()) {
            throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
        }

        return new ProcessedSlides(storedSlides, firstOriginalUrl);
    }

    private List<StoredSlide> renderPdfToSlides(Long materialId, byte[] pdfBytes, int startSlideIndex)
            throws IOException {
        List<StoredSlide> storedSlides = new ArrayList<>();

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFRenderer renderer = new PDFRenderer(document);
            int pageCount = document.getNumberOfPages();
            log.info("Rendering {} PDF page(s) for material {}", pageCount, materialId);

            if (pageCount == 0) {
                throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
            }

            for (int pageIndex = 0; pageIndex < pageCount; pageIndex++) {
                BufferedImage image = renderer.renderImageWithDPI(pageIndex, PDF_RENDER_DPI);
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ImageIO.write(image, "png", outputStream);

                int slideIndex = startSlideIndex + pageIndex;
                String imageUrl = fileStorageService.storeSlideImage(
                        materialId, slideIndex, outputStream.toByteArray());
                storedSlides.add(new StoredSlide(slideIndex, imageUrl));
            }
        }

        return storedSlides;
    }

    private ProcessedSlides processImages(Long materialId, MultipartFile[] files) {
        List<MultipartFile> sortedFiles = sortedCopy(files);

        List<StoredSlide> storedSlides = new ArrayList<>();

        try {
            for (int index = 0; index < sortedFiles.size(); index++) {
                MultipartFile file = sortedFiles.get(index);
                validateImage(file);

                int slideIndex = index + 1;
                String imageUrl = fileStorageService.storeSlideImage(
                        materialId, slideIndex, file.getBytes());
                storedSlides.add(new StoredSlide(slideIndex, imageUrl));
            }
        } catch (AppException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Failed to process image slides for material {}", materialId, exception);
            throw new AppException(ErrorCode.SLIDE_PROCESSING_FAILED);
        }

        return new ProcessedSlides(storedSlides, null);
    }

    private void validateImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE_UPLOAD);
        }

        if (!isImage(file)) {
            throw new AppException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
    }

    private boolean isImage(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        String extension = fileStorageService.getExtension(file.getOriginalFilename());

        boolean validContentType = contentType != null
                && IMAGE_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT));
        boolean validExtension = IMAGE_EXTENSIONS.contains(extension);

        return validContentType || validExtension;
    }

    private boolean allMatch(MultipartFile[] files, Predicate<MultipartFile> matcher) {
        return Arrays.stream(files).allMatch(matcher);
    }

    private List<MultipartFile> sortedCopy(MultipartFile[] files) {
        List<MultipartFile> sortedFiles = new ArrayList<>(List.of(files));
        sortedFiles.sort(Comparator.comparing(
                file -> file.getOriginalFilename(), Comparator.nullsLast(String::compareToIgnoreCase)));
        return sortedFiles;
    }

    private void validatePdf(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE_UPLOAD);
        }

        String contentType = file.getContentType();
        String extension = fileStorageService.getExtension(file.getOriginalFilename());

        boolean validContentType = contentType != null
                && PDF_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT));
        boolean validExtension = "pdf".equals(extension);

        if (!validContentType && !validExtension) {
            throw new AppException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
    }

    private void validatePptx(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE_UPLOAD);
        }
        if (!isPptx(file)) {
            throw new AppException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
    }

    private boolean isPdf(MultipartFile file) {
        String contentType = file.getContentType();
        String extension = fileStorageService.getExtension(file.getOriginalFilename());
        return "pdf".equals(extension)
                || (contentType != null && PDF_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT)));
    }

    private boolean isPptx(MultipartFile file) {
        String contentType = file.getContentType();
        String extension = fileStorageService.getExtension(file.getOriginalFilename());
        return "pptx".equals(extension) || "ppt".equals(extension)
                || (contentType != null && (
                        PPTX_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))
                                || PPT_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))));
    }

    public record StoredSlide(int slideIndex, String imageUrl) {}

    public record ProcessedSlides(List<StoredSlide> slides, String originalResourceUrl) {}
}
