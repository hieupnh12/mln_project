package com.sed10.mln.study.dto.response;


import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class LessonListResponse {
     Long LessonId;
     String chapterName;
     String teacherName;
     String title;

     List<MaterialResponse> materials;
}
