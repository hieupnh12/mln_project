package com.sed10.mln.study.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@Data
@EqualsAndHashCode(callSuper = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportExamAsQuizRequest extends BatchImportRequest {
    String title;
    String course;
    String chapter;
    String lesson;
    Integer duration;
    Integer passingScore;
    Boolean shuffleAnswers;
}
