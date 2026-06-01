package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionListItemResponse {
    String id;
    String title;
    String question;
    String type;
    String difficulty;
    String status;
    String course;
    String chapter;
    String lesson;
}
