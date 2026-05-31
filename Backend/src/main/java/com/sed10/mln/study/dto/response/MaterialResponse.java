package com.sed10.mln.study.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class MaterialResponse {
    private Long MaterialId;
    private Long lessonId;
    private String title;
    private String contentType;
    private String resourceUrl;
    private Integer slideCount;
    /** Ảnh demo: slide đầu hoặc thumbnail YouTube */
    private String previewImageUrl;
}
