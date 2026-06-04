package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentQuizCardResponse {
    String id;
    String title;
    String chapter;
    String lesson;
    int questionCount;
    int durationMinutes;
    int passingScore;
    String scheduleLabel;
    String icon;
}
