package com.sed10.mln.study.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PdfDocumentResponse {
    Long materialId;
    Long lessonId;
    String title;
    String resourceUrl;
    Integer pageCount;
    String lessonTitle;
    String chapterTitle;
    String subjectTitle;
}
