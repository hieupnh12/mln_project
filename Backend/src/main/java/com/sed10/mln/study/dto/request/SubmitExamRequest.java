package com.sed10.mln.study.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubmitExamRequest {
    Long studentId;
    Integer elapsedSeconds;
    /** ID câu hỏi trong phiên làm bài (Q-123); bắt buộc khi quiz random. */
    List<String> questionIds;
    List<SubmitExamAnswerRequest> answers;
}
