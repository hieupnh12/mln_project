package com.sed10.mln.study.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class SlideResponse {
    Long slideId;
    Integer slideIndex;
    String imageUrl;
}
