package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BatchImportReportResponse {
    int totalRows;
    int savedCount;
    int skippedExactDuplicate;
    int markedSimilar;
    int failedValidation;
    List<BatchImportRowResult> rows;
}
