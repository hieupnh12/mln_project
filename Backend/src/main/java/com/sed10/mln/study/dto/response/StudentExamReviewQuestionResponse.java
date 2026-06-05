package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentExamReviewQuestionResponse {
    int index;
    String id;
    String question;
    boolean correct;
    String explanation;
    List<StudentExamReviewOptionResponse> options;
}
