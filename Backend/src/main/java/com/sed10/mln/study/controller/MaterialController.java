package com.sed10.mln.study.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sed10.mln.study.dto.request.MaterialRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.MaterialDetailResponse;
import com.sed10.mln.study.dto.response.MaterialResponse;
import com.sed10.mln.study.service.MaterialService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MaterialController {

    final MaterialService materialSer;

    /**
     * Tạo material — bắt buộc một trong hai:
     * - files: nhiều ảnh PNG/JPG/WEBP, hoặc 1 file PDF/PPTX (slide deck)
     * - youtubeUrl: link video YouTube
     */
    @PostMapping(value = "/lesson/{lessonId:\\d+}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<MaterialDetailResponse> createMaterial(
            @PathVariable Long lessonId,
            @RequestParam("title") String title,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "youtubeUrl", required = false) String youtubeUrl) {
        return ApiResponse.<MaterialDetailResponse>builder()
                .result(materialSer.createMaterial(lessonId, title, files, youtubeUrl))
                .message("Create material successfully")
                .code(1014)
                .build();
    }

    @PutMapping(value = "/{materialId:\\d+}/slides", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<MaterialDetailResponse> replaceSlideDeck(
            @PathVariable Long materialId,
            @RequestParam(value = "title", required = false) String title,
            @RequestPart("files") MultipartFile[] files) {
        return ApiResponse.<MaterialDetailResponse>builder()
                .result(materialSer.replaceSlideDeck(materialId, title, files))
                .message("Replace slide deck successfully")
                .code(1019)
                .build();
    }

    @GetMapping("/{materialId:\\d+}")
    public ApiResponse<MaterialDetailResponse> getMaterialDetail(@PathVariable Long materialId) {
        return ApiResponse.<MaterialDetailResponse>builder()
                .result(materialSer.getMaterialDetail(materialId))
                .message("Get material detail successfully")
                .code(1020)
                .build();
    }

    @DeleteMapping("/{materialId:\\d+}")
    public ApiResponse<Void> deleteMaterial(@PathVariable Long materialId) {
        materialSer.deleteMaterial(materialId);
        return ApiResponse.<Void>builder()
                .message("Delete material successfully")
                .code(1015)
                .build();
    }

    @PatchMapping("/{materialId:\\d+}")
    public ApiResponse<Void> updateMaterial(
            @PathVariable Long materialId,
            @RequestBody MaterialRequest materialRequest) {
        materialSer.updateMaterial(materialId, materialRequest);
        return ApiResponse.<Void>builder()
                .message("Update material successfully")
                .code(1016)
                .build();
    }

    @GetMapping("/lesson/{lessonId:\\d+}")
    public ApiResponse<List<MaterialResponse>> listMaterialByLessonId(@PathVariable Long lessonId) {
        return ApiResponse.<List<MaterialResponse>>builder()
                .result(materialSer.listMaterialByLessonId(lessonId))
                .message("List material by lesson id successfully")
                .code(1017)
                .build();
    }
}
