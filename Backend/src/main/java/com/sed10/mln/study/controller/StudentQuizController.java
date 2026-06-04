package com.sed10.mln.study.controller;

import com.sed10.mln.study.constant.AttemptConstant;
import com.sed10.mln.study.constant.QuizConstant;
import com.sed10.mln.study.dto.request.SubmitExamRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.StudentExamReviewResponse;
import com.sed10.mln.study.dto.response.StudentExamSessionResponse;
import com.sed10.mln.study.dto.response.StudentExamSummaryResponse;
import com.sed10.mln.study.dto.response.StudentQuizCatalogResponse;
import com.sed10.mln.study.dto.response.SubmitExamResponse;
import com.sed10.mln.study.service.CurrentStudentResolver;
import com.sed10.mln.study.service.StudentExamService;
import com.sed10.mln.study.service.StudentQuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentQuizController {
    private final StudentQuizService studentQuizService;
    private final StudentExamService studentExamService;
    private final CurrentStudentResolver currentStudentResolver;

    @GetMapping("/courses/{subjectId}/quiz-catalog")
    public ApiResponse<StudentQuizCatalogResponse> listQuizCatalog(
            @PathVariable Long subjectId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "50") int completedLimit,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long resolvedStudentId = currentStudentResolver.resolveStudentId(authorization, studentId);
        return ApiResponse.<StudentQuizCatalogResponse>builder()
                .result(studentQuizService.listCatalog(subjectId, resolvedStudentId, completedLimit))
                .build();
    }

    @GetMapping("/courses/{subjectId}/quizzes/{quizId}/session")
    public ApiResponse<StudentExamSessionResponse> getExamSession(
            @PathVariable Long subjectId, @PathVariable String quizId) {
        return ApiResponse.<StudentExamSessionResponse>builder()
                .result(studentExamService.getSession(subjectId, QuizConstant.parseId(quizId)))
                .build();
    }

    @PostMapping("/courses/{subjectId}/quizzes/{quizId}/submit")
    public ApiResponse<SubmitExamResponse> submitExam(
            @PathVariable Long subjectId,
            @PathVariable String quizId,
            @RequestBody SubmitExamRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long resolvedStudentId = currentStudentResolver.resolveStudentId(authorization, request.getStudentId());
        request.setStudentId(resolvedStudentId);
        return ApiResponse.<SubmitExamResponse>builder()
                .message("Đã nộp bài kiểm tra")
                .result(studentExamService.submitExam(
                        subjectId, QuizConstant.parseId(quizId), request))
                .build();
    }

    @GetMapping("/courses/{subjectId}/attempts/{attemptId}/summary")
    public ApiResponse<StudentExamSummaryResponse> getAttemptSummary(
            @PathVariable Long subjectId,
            @PathVariable String attemptId,
            @RequestParam(required = false) Long studentId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long resolvedStudentId = currentStudentResolver.resolveStudentId(authorization, studentId);
        return ApiResponse.<StudentExamSummaryResponse>builder()
                .result(studentExamService.getAttemptSummary(
                        subjectId, AttemptConstant.parseId(attemptId), resolvedStudentId))
                .build();
    }

    @GetMapping("/courses/{subjectId}/attempts/{attemptId}/review")
    public ApiResponse<StudentExamReviewResponse> getAttemptReview(
            @PathVariable Long subjectId,
            @PathVariable String attemptId,
            @RequestParam(required = false) Long studentId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long resolvedStudentId = currentStudentResolver.resolveStudentId(authorization, studentId);
        return ApiResponse.<StudentExamReviewResponse>builder()
                .result(studentExamService.getAttemptReview(
                        subjectId, AttemptConstant.parseId(attemptId), resolvedStudentId))
                .build();
    }
}
