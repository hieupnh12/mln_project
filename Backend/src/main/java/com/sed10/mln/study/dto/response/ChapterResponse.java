package com.sed10.mln.study.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class ChapterResponse {
    private Long chapterId;
    private Long subjectId;
    private String title;
    
}
