package com.sed10.mln.study.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class MaterialDetailResponse {
    Long materialId;
    Long lessonId;
    String title;
    String contentType;
    String resourceUrl;
    Integer slideCount;
    /** Chỉ có khi contentType = YOUTUBE */
    String youtubeVideoId;
    String youtubeEmbedUrl;
    List<SlideResponse> slides;
}
