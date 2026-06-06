package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.request.UpdateStudentProgressRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.StudentProgressResponse;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.service.CurrentStudentResolver;
import com.sed10.mln.study.service.StudentProgressService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentProgressController {
    StudentProgressService studentProgressService;
    CurrentStudentResolver currentStudentResolver;

    private Long requireStudentId(String authorization, Long paramStudentId) {
        Long resolvedStudentId = currentStudentResolver.resolveStudentId(authorization, paramStudentId);
        if (resolvedStudentId == null) {
            throw new AppException(ErrorCode.STUDENT_ACCESS_DENIED);
        }
        return resolvedStudentId;
    }

    @GetMapping("/lessons/{lessonId}/progress")
    public ApiResponse<StudentProgressResponse> getLessonProgress(
            @PathVariable Long lessonId,
            @RequestParam(required = false) Long studentId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long resolvedStudentId = requireStudentId(authorization, studentId);
        return ApiResponse.<StudentProgressResponse>builder()
                .result(studentProgressService.getLessonProgress(resolvedStudentId, lessonId))
                .build();
    }

    @PutMapping("/lessons/{lessonId}/progress")
    public ApiResponse<StudentProgressResponse> updateLessonProgress(
            @PathVariable Long lessonId,
            @RequestBody UpdateStudentProgressRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long resolvedStudentId = requireStudentId(authorization, request.getStudentId());
        return ApiResponse.<StudentProgressResponse>builder()
                .message("Cập nhật tiến độ bài học thành công")
                .result(studentProgressService.updateLessonProgress(resolvedStudentId, lessonId, request))
                .build();
    }

    @GetMapping("/chapters/{chapterId}/lesson-progress")
    public ApiResponse<List<StudentProgressResponse>> listChapterLessonProgress(
            @PathVariable Long chapterId,
            @RequestParam(required = false) Long studentId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long resolvedStudentId = requireStudentId(authorization, studentId);
        return ApiResponse.<List<StudentProgressResponse>>builder()
                .result(studentProgressService.listProgressByChapter(resolvedStudentId, chapterId))
                .build();
    }

    @GetMapping("/courses/{subjectId}/lesson-progress")
    public ApiResponse<List<StudentProgressResponse>> listSubjectLessonProgress(
            @PathVariable Long subjectId,
            @RequestParam(required = false) Long studentId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long resolvedStudentId = requireStudentId(authorization, studentId);
        return ApiResponse.<List<StudentProgressResponse>>builder()
                .result(studentProgressService.listProgressBySubject(resolvedStudentId, subjectId))
                .build();
    }
}
