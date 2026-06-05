package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentExamSessionResponse {
    String quizId;
    String title;
    String courseTitle;
    int durationMinutes;
    int passingScore;
    int questionCount;
    List<StudentExamQuestionResponse> questions;
}
