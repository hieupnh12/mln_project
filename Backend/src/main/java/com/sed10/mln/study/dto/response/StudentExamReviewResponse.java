package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentExamReviewResponse {
    String attemptId;
    String quizId;
    String quizTitle;
    String courseTitle;
    String scoreLabel;
    int scorePercent;
    int correctCount;
    int totalQuestions;
    boolean passed;
    String submittedAt;
    List<StudentExamReviewQuestionResponse> questions;
}
