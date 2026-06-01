package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionResponse {
    String id;
    Long lessonId;
    String title;
    String question;
    String type;
    String difficulty;
    String status;
    String course;
    String chapter;
    String lesson;
    String answer;
    String explanation;
    BigDecimal score;
    Integer estimatedTime;
    List<String> tags;
    List<String> options;
    String updatedBy;
    String duplicateWarning;
}
