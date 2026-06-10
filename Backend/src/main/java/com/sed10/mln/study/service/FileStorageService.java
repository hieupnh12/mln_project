package com.sed10.mln.study.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    private static final String ROOT_FOLDER = "mln-study/materials";

    private final Cloudinary cloudinary;

    public String storeSlideImage(Long materialId, int slideIndex, byte[] imageBytes) {
        Map<String, Object> params = ObjectUtils.asMap(
                "folder", buildFolder(materialId),
                "public_id", "slide-" + String.format("%03d", slideIndex),
                "overwrite", true,
                "resource_type", "image",
                "format", "png");

        return uploadAndGetUrl(imageBytes, params);
    }

    public String storeOriginalFile(Long materialId, String filename, byte[] fileBytes) {
        return storeOriginalFile(materialId, filename, fileBytes, 1);
    }

    public String storeOriginalFile(Long materialId, String filename, byte[] fileBytes, int sequence) {
        String extension = getExtension(filename);
        String publicId = sequence <= 1
                ? "original." + extension
                : "original-" + String.format("%03d", sequence) + "." + extension;
        Map<String, Object> params = ObjectUtils.asMap(
                "folder", buildFolder(materialId),
                "public_id", publicId,
                "overwrite", true,
                "resource_type", "raw");

        return uploadAndGetUrl(fileBytes, params);
    }

    public void deleteMaterialFiles(Long materialId) {
        String prefix = buildFolder(materialId) + "/";
        try {
            cloudinary.api().deleteResourcesByPrefix(prefix, ObjectUtils.asMap("resource_type", "image"));
            cloudinary.api().deleteResourcesByPrefix(prefix, ObjectUtils.asMap("resource_type", "raw"));
            cloudinary.api().deleteResourcesByPrefix(prefix, ObjectUtils.asMap("resource_type", "auto"));
        } catch (Exception exception) {
            log.warn("Failed to delete Cloudinary files for material {}: {}", materialId, exception.getMessage());
        }
    }

    public String getExtension(String filename) {
        if (!StringUtils.hasText(filename) || !filename.contains(".")) {
            return "bin";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private String uploadAndGetUrl(byte[] bytes, Map<String, Object> params) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(bytes, params);
            return (String) result.get("secure_url");
        } catch (Exception exception) {
            log.error("Cloudinary upload failed. params={}", params, exception);
            throw new AppException(ErrorCode.CLOUDINARY_UPLOAD_FAILED);
        }
    }

    private String buildFolder(Long materialId) {
        return ROOT_FOLDER + "/" + materialId;
    }
}
