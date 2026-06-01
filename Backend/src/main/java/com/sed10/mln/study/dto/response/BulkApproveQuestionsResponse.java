package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BulkApproveQuestionsResponse {
    int requestedCount;
    int approvedCount;
    int skippedNotPending;
    int skippedWarning;
    int notFound;
}
