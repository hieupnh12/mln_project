package com.sed10.mln.study.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnswerOptionRequest {
    String content;
    Boolean isCorrect;
}
