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
    public ChapterResponse createChapter(@RequestBody ChapterRequest request, @PathVariable Long subjectId) {
        return chapterSer.createChapter(request, subjectId);
    }


    @GetMapping("/{subjectId}")
    public List<ChapterResponse> getChapterBySubjectId(@PathVariable Long subjectId) {
        return chapterSer.getChapterBySubjectId(subjectId);
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
    public ChapterResponse updateChapter(@PathVariable Long id, @RequestBody ChapterRequest request) {
        return chapterSer.updateChapter(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteChapter(@PathVariable Long id) {
        chapterSer.deleteChapter(id);
    }
}
