package com.sed10.mln.study.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class LessonRequest {
    private Long chapterId;
    private Long teacherId;
    private String title;
}
