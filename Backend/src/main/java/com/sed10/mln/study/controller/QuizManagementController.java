package com.sed10.mln.study.controller;

import com.sed10.mln.study.constant.QuizConstant;
import com.sed10.mln.study.dto.request.SaveQuizRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.QuestionListResponse;
import com.sed10.mln.study.dto.response.QuizDetailResponse;
import com.sed10.mln.study.dto.response.QuizListResponse;
import com.sed10.mln.study.dto.response.QuizStatsResponse;
import com.sed10.mln.study.service.QuizManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher/quizzes")
@RequiredArgsConstructor
public class QuizManagementController {
    private final QuizManagementService quizManagementService;

    @GetMapping
    public ApiResponse<QuizListResponse> listQuizzes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "all") String course,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.<QuizListResponse>builder()
                .result(quizManagementService.listQuizzes(search, course, status, page, size))
                .build();
    }

    @GetMapping("/stats")
    public ApiResponse<QuizStatsResponse> stats() {
        return ApiResponse.<QuizStatsResponse>builder()
                .result(quizManagementService.getStats())
                .build();
    }

    @GetMapping("/candidate-questions")
    public ApiResponse<QuestionListResponse> candidateQuestions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "all") String course,
            @RequestParam(required = false, defaultValue = "all") String chapter,
            @RequestParam(required = false, defaultValue = "all") String lesson,
            @RequestParam(required = false, defaultValue = "all") String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return ApiResponse.<QuestionListResponse>builder()
                .result(quizManagementService.listCandidateQuestions(
                        search, course, chapter, lesson, difficulty, page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<QuizDetailResponse> getQuiz(@PathVariable String id) {
        return ApiResponse.<QuizDetailResponse>builder()
                .result(quizManagementService.getQuiz(QuizConstant.parseId(id)))
                .build();
    }

    @PostMapping
    public ApiResponse<QuizDetailResponse> createQuiz(@RequestBody SaveQuizRequest request) {
        return ApiResponse.<QuizDetailResponse>builder()
                .message("Đã tạo quiz")
                .result(quizManagementService.createQuiz(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<QuizDetailResponse> updateQuiz(
            @PathVariable String id, @RequestBody SaveQuizRequest request) {
        return ApiResponse.<QuizDetailResponse>builder()
                .message("Đã lưu quiz")
                .result(quizManagementService.updateQuiz(QuizConstant.parseId(id), request))
                .build();
    }

    @PostMapping("/{id}/publish")
    public ApiResponse<QuizDetailResponse> publishQuiz(@PathVariable String id) {
        return ApiResponse.<QuizDetailResponse>builder()
                .message("Đã xuất bản quiz")
                .result(quizManagementService.publishQuiz(QuizConstant.parseId(id)))
                .build();
    }

    @PostMapping("/{id}/duplicate")
    public ApiResponse<QuizDetailResponse> duplicateQuiz(@PathVariable String id) {
        return ApiResponse.<QuizDetailResponse>builder()
                .message("Đã nhân bản quiz")
                .result(quizManagementService.duplicateQuiz(QuizConstant.parseId(id)))
                .build();
    }

    @PostMapping("/{id}/close")
    public ApiResponse<Void> closeQuiz(@PathVariable String id) {
        quizManagementService.closeQuiz(QuizConstant.parseId(id));
        return ApiResponse.<Void>builder()
                .message("Đã tắt quiz")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteQuiz(@PathVariable String id) {
        quizManagementService.deleteQuiz(QuizConstant.parseId(id));
        return ApiResponse.<Void>builder()
                .message("Đã xóa quiz")
                .build();
    }
}
