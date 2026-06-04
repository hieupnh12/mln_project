package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentExamDifficultySliceResponse {
    String key;
    String label;
    int count;
    int correctCount;
    /** Tỷ lệ đúng trong nhóm độ khó (0–100). */
    int percent;
    /** Tỷ trọng câu hỏi trong bài làm — dùng cho biểu đồ donut. */
    int sharePercent;
}
