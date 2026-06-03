package com.sed10.mln.study.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class LessonResponse {
    private Long LessonId;
    private String chapterName;
    private String teacherName;
    private String title;
    private String content;
}
