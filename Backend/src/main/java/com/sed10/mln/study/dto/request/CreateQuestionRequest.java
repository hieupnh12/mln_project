package com.sed10.mln.study.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateQuestionRequest {
    Long lessonId;
    String title;
    String question;
    String type;
    String difficulty;
    String status;
    String bloomLevel;
    String explanation;
    String answer;
    BigDecimal score;
    Integer estimatedTime;
    List<String> tags = new ArrayList<>();
    List<AnswerOptionRequest> options = new ArrayList<>();
    Integer correctOptionIndex;
    Boolean allowSimilarSave = true;
}
