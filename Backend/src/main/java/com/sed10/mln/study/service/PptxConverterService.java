package com.sed10.mln.study.service;

import com.sed10.mln.study.config.LibreOfficeProperties;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PptxConverterService {

    private final LibreOfficeProperties libreOfficeProperties;

    public byte[] convertToPdf(MultipartFile pptxFile) throws IOException {
        if (!libreOfficeProperties.isEnabled()) {
            throw new AppException(ErrorCode.LIBREOFFICE_NOT_AVAILABLE);
        }

        Path officeBinary = Path.of(libreOfficeProperties.getPath());
        if (!Files.exists(officeBinary)) {
            throw new AppException(ErrorCode.LIBREOFFICE_NOT_AVAILABLE);
        }

        Path tempDir = Files.createTempDirectory("pptx-convert-");
        Path inputFile = tempDir.resolve("input.pptx");

        try {
            pptxFile.transferTo(inputFile.toFile());

            Process process = new ProcessBuilder(
                    officeBinary.toString(),
                    "--headless",
                    "--norestore",
                    "--convert-to", "pdf",
                    "--outdir", tempDir.toString(),
                    inputFile.toString())
                    .redirectErrorStream(true)
                    .start();

            boolean finished = process.waitFor(
                    libreOfficeProperties.getConvertTimeoutSeconds(),
                    TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                throw new AppException(ErrorCode.PPTX_CONVERSION_FAILED);
            }

            if (process.exitValue() != 0) {
                throw new AppException(ErrorCode.PPTX_CONVERSION_FAILED);
            }

            Path pdfFile = findConvertedPdf(tempDir);
            return Files.readAllBytes(pdfFile);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new AppException(ErrorCode.PPTX_CONVERSION_FAILED);
        } catch (AppException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new AppException(ErrorCode.PPTX_CONVERSION_FAILED);
        } finally {
            deleteDirectory(tempDir);
        }
    }

    private Path findConvertedPdf(Path directory) throws IOException {
        try (Stream<Path> paths = Files.walk(directory)) {
            return paths
                    .filter(path -> Files.isRegularFile(path) && path.toString().endsWith(".pdf"))
                    .findFirst()
                    .orElseThrow(() -> new AppException(ErrorCode.PPTX_CONVERSION_FAILED));
        }
    }

    private void deleteDirectory(Path directory) {
        if (!Files.exists(directory)) {
            return;
        }
        try (Stream<Path> paths = Files.walk(directory)) {
            paths.sorted(Comparator.reverseOrder()).forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException ignored) {
                    // best-effort cleanup
                }
            });
        } catch (IOException ignored) {
            // best-effort cleanup
        }
    }
}
