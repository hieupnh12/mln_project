package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuizDetailResponse {
    String id;
    String title;
    String course;
    String chapter;
    String lesson;
    int duration;
    int passingScore;
    int randomCount;
    boolean shuffleAnswers;
    boolean randomQuestions;
    String status;
    String updatedAt;
    String createdAt;
    long attemptCount;
    int questionCount;
    List<String> questionIds;
    List<QuestionResponse> questions;
}
