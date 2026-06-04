package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentExamImproveTopicResponse {
    String title;
    String description;
    int wrongCount;
    int totalCount;
    /** error | progress | ok */
    String variant;
}
