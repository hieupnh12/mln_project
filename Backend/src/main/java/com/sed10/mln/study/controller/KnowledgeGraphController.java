package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.request.SaveMindmapRequest;
import com.sed10.mln.study.dto.response.ApiResponse;
import com.sed10.mln.study.dto.response.MindmapResponse;
import com.sed10.mln.study.service.KnowledgeGraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class KnowledgeGraphController {

    private final KnowledgeGraphService knowledgeGraphService;

    @GetMapping("/{courseId}/mindmap")
    public ResponseEntity<ApiResponse<MindmapResponse>> getMindmap(@PathVariable Long courseId) {
        MindmapResponse response = knowledgeGraphService.getMindmap(courseId);
        return ResponseEntity.ok(ApiResponse.<MindmapResponse>builder()
                .code(0)
                .message("Success")
                .result(response)
                .build());
    }

    @PostMapping("/{courseId}/mindmap")
    public ResponseEntity<ApiResponse<Void>> saveMindmap(
            @PathVariable Long courseId,
            @RequestBody SaveMindmapRequest request) {
        
        if (request.getCourseId() == null) {
            request.setCourseId(String.valueOf(courseId));
        }

        knowledgeGraphService.saveMindmap(courseId, request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(0)
                .message("Mindmap saved successfully")
                .build());
    }
}
