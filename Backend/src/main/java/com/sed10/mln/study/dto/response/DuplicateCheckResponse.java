package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DuplicateCheckResponse {
    boolean exactDuplicate;
    boolean similarDuplicate;
    String warningMessage;
    QuestionResponse matchedQuestion;
}
