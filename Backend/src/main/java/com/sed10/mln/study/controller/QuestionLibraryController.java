package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.request.BatchImportRequest;
import com.sed10.mln.study.dto.request.CheckDuplicateRequest;
import com.sed10.mln.study.dto.request.CreateQuestionRequest;
import com.sed10.mln.study.dto.response.DuplicateCheckResponse;
import com.sed10.mln.study.dto.response.BatchImportReportResponse;
import com.sed10.mln.study.dto.response.QuestionListResponse;
import com.sed10.mln.study.dto.response.QuestionMetadataResponse;
import com.sed10.mln.study.dto.response.QuestionResponse;
import com.sed10.mln.study.dto.response.QuestionStatsResponse;
import com.sed10.mln.study.service.QuestionLibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/teacher/question-library")
@RequiredArgsConstructor
public class QuestionLibraryController {
    private final QuestionLibraryService questionLibraryService;

    @GetMapping("/metadata")
    public ApiResponse<QuestionMetadataResponse> metadata() {
        return ApiResponse.<QuestionMetadataResponse>builder()
                .result(questionLibraryService.getMetadata())
                .build();
    }

    @GetMapping("/questions")
    public ApiResponse<QuestionListResponse> listQuestions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "all") String course,
            @RequestParam(required = false, defaultValue = "all") String chapter,
            @RequestParam(required = false, defaultValue = "all") String lesson,
            @RequestParam(required = false, defaultValue = "all") String difficulty,
            @RequestParam(required = false, defaultValue = "all") String type,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size) {
        return ApiResponse.<QuestionListResponse>builder()
                .result(questionLibraryService.listQuestions(
                        search, course, chapter, lesson, difficulty, type, status, page, size))
                .build();
    }

    @GetMapping("/stats")
    public ApiResponse<QuestionStatsResponse> stats() {
        return ApiResponse.<QuestionStatsResponse>builder()
                .result(questionLibraryService.getStats())
                .build();
    }

    @PostMapping("/questions/check-duplicate")
    public ApiResponse<DuplicateCheckResponse> checkDuplicate(@RequestBody CheckDuplicateRequest request) {
        return ApiResponse.<DuplicateCheckResponse>builder()
                .result(questionLibraryService.checkDuplicate(request))
                .build();
    }

    @PostMapping("/questions")
    public ApiResponse<QuestionResponse> createQuestion(@RequestBody CreateQuestionRequest request) {
        return ApiResponse.<QuestionResponse>builder()
                .result(questionLibraryService.createQuestion(request))
                .build();
    }

    @PostMapping("/questions/batch-import")
    public ApiResponse<BatchImportReportResponse> batchImport(@RequestBody BatchImportRequest request) {
        return ApiResponse.<BatchImportReportResponse>builder()
                .result(questionLibraryService.batchImport(request))
                .build();
    }

    @DeleteMapping("/questions/{id}")
    public ApiResponse<Void> deleteQuestion(@PathVariable Long id) {
        questionLibraryService.deleteQuestion(id);
        return ApiResponse.<Void>builder().message("Đã xóa câu hỏi").build();
    }

    @DeleteMapping("/questions")
    public ApiResponse<Void> deleteQuestions(@RequestParam String ids) {
        List<Long> parsedIds = Arrays.stream(ids.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .map(value -> value.startsWith("Q-") ? value.substring(2) : value)
                .map(Long::valueOf)
                .toList();
        questionLibraryService.deleteQuestions(parsedIds);
        return ApiResponse.<Void>builder().message("Đã xóa các câu hỏi đã chọn").build();
    }
}
