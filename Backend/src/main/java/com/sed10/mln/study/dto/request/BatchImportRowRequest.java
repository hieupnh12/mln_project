package com.sed10.mln.study.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BatchImportRowRequest {
    String rowId;
    String content;
    String type;
    String difficulty;
    String tags;
    Long lessonId;
    String subjectTitle;
    String chapterTitle;
    String lessonTitle;
    List<AnswerOptionRequest> options = new ArrayList<>();
    String answer;
    String explanation;
}
