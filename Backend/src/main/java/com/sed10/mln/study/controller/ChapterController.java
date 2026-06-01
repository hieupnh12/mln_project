package com.sed10.mln.study.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sed10.mln.study.dto.request.ChapterRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.ChapterResponse;
import com.sed10.mln.study.service.ChapterService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

@RestController
@RequestMapping("/chapters")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChapterController {
    final ChapterService chapterSer;

    @PostMapping("/create/{subjectId}")
    public ApiResponse<ChapterResponse> createChapter(@RequestBody ChapterRequest request, @PathVariable Long subjectId) {
        return ApiResponse.<ChapterResponse>builder()
                .result(chapterSer.createChapter(request, subjectId))
                .message("Create chapter successfully")
                .code(1010)
                .build();
    }


    @GetMapping("/{subjectId}")
    public ApiResponse<List<ChapterResponse>> getChapterBySubjectId(@PathVariable Long subjectId) {
        return ApiResponse.<List<ChapterResponse>>builder()
                .result(chapterSer.getChapterBySubjectId(subjectId))
                .message("Get chapter by subject id successfully")
                .code(1011)
                .build();
    }


    // @GetMapping("/all")
    // public ApiResponse<List<ChapterResponse>> getAllChapters() {
    //     return ApiResponse.<List<ChapterResponse>>builder()
    //     .result(chapterSer.getAllChapters())
    //     .message("Get all chapters successfully")
    //     .code(1010)
    //     .build();
    // }

    @PatchMapping("/{id}")
    public ApiResponse<ChapterResponse> updateChapter(@PathVariable Long id, @RequestBody ChapterRequest request) {
        return ApiResponse.<ChapterResponse>builder()
                .result(chapterSer.updateChapter(id, request))
                .message("Update chapter successfully")
                .code(1012)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteChapter(@PathVariable Long id) {
        chapterSer.deleteChapter(id);
        return ApiResponse.<Void>builder()
                .message("Delete chapter successfully")
                .code(1013)
                .build();
    }
    

    
}
