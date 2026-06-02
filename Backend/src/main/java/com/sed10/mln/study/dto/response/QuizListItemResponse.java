package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizListItemResponse {
    String id;
    String title;
    String course;
    String chapter;
    String lesson;
    int questionCount;
    int duration;
    int passingScore;
    String status;
    String updatedAt;
    String createdAt;
    long attemptCount;
}
