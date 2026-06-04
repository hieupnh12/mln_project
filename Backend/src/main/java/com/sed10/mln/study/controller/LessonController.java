package com.sed10.mln.study.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import com.sed10.mln.study.dto.request.LessonRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.LessonListResponse;
import com.sed10.mln.study.dto.response.LessonResponse;
import com.sed10.mln.study.service.LessonService;

@RestController
@RequestMapping({"/api/lessons", "/lessons"})
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LessonController {

    final LessonService lessonSer;

    @PostMapping("/chapter/{chapterId:\\d+}/teacher/{teacherId:\\d+}")
    public ApiResponse<LessonResponse> createLesson(
        @RequestBody LessonRequest lessonRequest,
            @PathVariable Long chapterId,
            @PathVariable Long teacherId) {
        return ApiResponse.<LessonResponse>builder()
                .result(lessonSer.createLesson(lessonRequest, chapterId, teacherId))
                .message("Create lesson successfully")
                .code(1010)
                .build();
    }

    @DeleteMapping("/{lessonId:\\d+}")
    public ApiResponse<Void> deleteLesson(@PathVariable Long lessonId) {
        lessonSer.deleteLesson(lessonId);
        return ApiResponse.<Void>builder()
                .message("Delete lesson successfully")
                .code(1011)
                .build();
    }


    @PatchMapping("/{lessonId}")
    public ApiResponse<Void> updateLesson(@PathVariable Long lessonId, @RequestBody LessonRequest lessonRequest) {
        lessonSer.updateLesson(lessonId, lessonRequest);
        return ApiResponse.<Void>builder()
                .message("Update lesson successfully")
                .code(1012)
                .build();
    }

    @GetMapping("/{lessonId:\\d+}")
    public ApiResponse<LessonResponse> getLessonById(@PathVariable Long lessonId) {
        return ApiResponse.<LessonResponse>builder()
                .result(lessonSer.getLessonById(lessonId))
                .message("Get lesson by id successfully")
                .code(1014)
                .build();
    }


    @GetMapping("/chapter/{chapterId:\\d+}")
    public ApiResponse<List<LessonListResponse>> listlessonAndMaterialByChapterId(@PathVariable Long chapterId) {
        return ApiResponse.<List<LessonListResponse>>builder()
                .result(lessonSer.listlessonAndMaterialByChapterId(chapterId))
                .message("List lesson and material by chapter id successfully")
                .code(1013)
                .build();
    }

}
