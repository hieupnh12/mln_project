package com.sed10.mln.study.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.SubjectDocumentResponse;
import com.sed10.mln.study.service.SubjectDocumentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping({"/api/subject-documents", "/subject-documents"})
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectDocumentController {

    SubjectDocumentService subjectDocumentService;

    @GetMapping
    public ApiResponse<List<SubjectDocumentResponse>> listAll() {
        return ApiResponse.<List<SubjectDocumentResponse>>builder()
                .result(subjectDocumentService.listAll())
                .message("List subject documents successfully")
                .code(1030)
                .build();
    }

    @GetMapping("/subject/{subjectId:\\d+}")
    public ApiResponse<List<SubjectDocumentResponse>> listBySubject(@PathVariable Long subjectId) {
        return ApiResponse.<List<SubjectDocumentResponse>>builder()
                .result(subjectDocumentService.listBySubject(subjectId))
                .message("List subject documents by subject successfully")
                .code(1031)
                .build();
    }

    @PostMapping(value = "/subject/{subjectId:\\d+}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<SubjectDocumentResponse> upload(
            @PathVariable Long subjectId,
            @RequestParam("title") String title,
            @RequestPart("file") MultipartFile file) {
        return ApiResponse.<SubjectDocumentResponse>builder()
                .result(subjectDocumentService.upload(subjectId, title, file))
                .message("Upload subject document successfully")
                .code(1032)
                .build();
    }

    @DeleteMapping("/{documentId:\\d+}")
    public ApiResponse<Void> delete(@PathVariable Long documentId) {
        subjectDocumentService.delete(documentId);
        return ApiResponse.<Void>builder()
                .message("Delete subject document successfully")
                .code(1033)
                .build();
    }
}
