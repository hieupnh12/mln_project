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
@RequestMapping("/subjects")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectController {
    final SubjectService subjectSer;

    @PostMapping("/create")
    public SubjectResponse createSubject(@RequestBody SubjectRequest request) {
        return subjectSer.createSubject(request);
    }

    @GetMapping("/{id}")
    public SubjectResponse getSubjectById(@PathVariable Long id) {
        return subjectSer.getSubjectById(id);
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
    public SubjectResponse updateSubject(@PathVariable Long id, @RequestBody SubjectRequest request) {
        return subjectSer.updateSubject(id, request);
    }


    @DeleteMapping("/{id}")
    public void deleteSubject(@PathVariable Long id) {
        subjectSer.deleteSubject(id);
    }
}
