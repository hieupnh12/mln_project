package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentExamReviewOptionResponse {
    Long answerId;
    String label;
    String content;
    /** correct | selected_wrong | default */
    String state;
}
