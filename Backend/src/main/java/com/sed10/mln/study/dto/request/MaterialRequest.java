package com.sed10.mln.study.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class MaterialRequest {
    private String title;
    private String youtubeUrl;
}
