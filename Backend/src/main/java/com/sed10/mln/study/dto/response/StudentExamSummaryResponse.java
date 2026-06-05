package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentExamSummaryResponse {
    String attemptId;
    String quizId;
    String quizTitle;
    String courseTitle;
    String scoreLabel;
    boolean passed;
    int correctCount;
    int totalQuestions;
    int accuracyPercent;
    int passingScore;
    int elapsedSeconds;
    int durationMinutes;
    String submittedAt;
    boolean hasDifficultyChart;
    String difficultySummaryLabel;
    List<StudentExamDifficultySliceResponse> difficultyBreakdown;
    List<StudentExamImproveTopicResponse> improveTopics;
}
