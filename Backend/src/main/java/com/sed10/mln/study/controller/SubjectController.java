package com.sed10.mln.study.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

import com.sed10.mln.study.dto.request.SubjectRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.SubjectResponse;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.service.SubjectService;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectController {
    final SubjectService subjectSer;

    @PostMapping("/create")
    public ApiResponse<SubjectResponse> createSubject(@RequestBody SubjectRequest request) {
        return ApiResponse.<SubjectResponse>builder()
                .result(subjectSer.createSubject(request))
                .message("Create subject successfully")
                .code(1010)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<SubjectResponse> getSubjectById(@PathVariable Long id) {
        return ApiResponse.<SubjectResponse>builder()
                .result(subjectSer.getSubjectById(id))
                .message("Get subject by id successfully")
                .code(1011)
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<SubjectResponse>> getAllSubjects() {
        return ApiResponse.<List<SubjectResponse>>builder()
        .result(subjectSer.getAllSubjects())
        .message("Get all subjects successfully")
        .code(1010)
        .build();
    }

    

    @PutMapping("/{id}")
    public ApiResponse<SubjectResponse> updateSubject(@PathVariable Long id, @RequestBody SubjectRequest request) {
        return ApiResponse.<SubjectResponse>builder()
                .result(subjectSer.updateSubject(id, request))
                .message("Update subject successfully")
                .code(1012)
                .build();
    }


    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSubject(@PathVariable Long id) {
        return ApiResponse.<Void>builder()
                .message("Delete subject successfully")
                .code(1013)
                .build();
    }
}
