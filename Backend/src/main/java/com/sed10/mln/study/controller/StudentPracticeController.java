package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.QuestionResponse;
import com.sed10.mln.study.service.StudentPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentPracticeController {
    private final StudentPracticeService studentPracticeService;

    @GetMapping("/courses/{subjectId}/practice-questions")
    public ApiResponse<List<QuestionResponse>> listPracticeQuestions(
            @PathVariable Long subjectId,
            @RequestParam(required = false) Long chapterId,
            @RequestParam(required = false) Long lessonId,
            @RequestParam(defaultValue = "200") int size) {
        return ApiResponse.<List<QuestionResponse>>builder()
                .result(studentPracticeService.listPracticeQuestions(subjectId, chapterId, lessonId, size))
                .build();
    }
}
