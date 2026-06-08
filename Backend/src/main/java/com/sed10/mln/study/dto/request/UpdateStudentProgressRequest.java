package com.sed10.mln.study.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateStudentProgressRequest {
    /** NOT_STARTED | IN_PROGRESS | COMPLETED */
    String status;

    /** Dev fallback khi chưa có JWT. */
    Long studentId;
}
