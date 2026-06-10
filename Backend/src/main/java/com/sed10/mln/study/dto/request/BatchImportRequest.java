package com.sed10.mln.study.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BatchImportRequest {
    Long lessonId;
    String targetStatus;
    List<BatchImportRowRequest> rows = new ArrayList<>();
}
