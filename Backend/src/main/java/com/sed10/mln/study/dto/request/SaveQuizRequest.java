package com.sed10.mln.study.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SaveQuizRequest {
    String title;
    String course;
    String chapter;
    String lesson;
    Integer duration;
    Integer passingScore;
    Integer randomCount;
    Boolean shuffleAnswers;
    Boolean randomQuestions;
    List<String> questionIds;
}
