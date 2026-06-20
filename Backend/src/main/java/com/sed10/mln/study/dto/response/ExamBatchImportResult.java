package com.sed10.mln.study.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExamBatchImportResult {
    @Builder.Default
    List<String> questionIds = new ArrayList<>();

    BatchImportReportResponse report;
}
