package com.sed10.mln.study.controller;

import com.sed10.mln.study.dto.request.SaveMindmapRequest;
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
    public ResponseEntity<MindmapResponse> getMindmap(@PathVariable Long courseId) {
        MindmapResponse response = knowledgeGraphService.getMindmap(courseId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{courseId}/mindmap")
    public ResponseEntity<Void> saveMindmap(
            @PathVariable Long courseId,
            @RequestBody SaveMindmapRequest request) {
        
        if (request.getCourseId() == null) {
            request.setCourseId(String.valueOf(courseId));
        }

        knowledgeGraphService.saveMindmap(courseId, request);
        return ResponseEntity.ok().build();
    }
}
