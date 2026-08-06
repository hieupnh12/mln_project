package com.sed10.mln.study.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectDocumentResponse {
    Long documentId;
    Long subjectId;
    String subjectTitle;
    String title;
    String resourceUrl;
    String originalFilename;
    String fileExtension;
    Long fileSize;
    LocalDateTime createdAt;
}
