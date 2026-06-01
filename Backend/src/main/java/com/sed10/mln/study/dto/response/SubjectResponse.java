package com.sed10.mln.study.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data   
public class SubjectResponse {
    private Long subjectId;
    private String subjectCode;
    private String title;
    private String description;
}
