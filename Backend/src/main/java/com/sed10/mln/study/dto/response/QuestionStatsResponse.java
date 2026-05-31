package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionStatsResponse {
    long totalQuestions;
    long totalCourses;
    Map<String, Long> byDifficulty;
    Map<String, Long> byStatus;
}
