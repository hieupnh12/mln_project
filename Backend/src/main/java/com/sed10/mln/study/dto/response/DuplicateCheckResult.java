package com.sed10.mln.study.dto.response;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DuplicateCheckResult {
    String contentHash;
    String normalizedContent;
    boolean exactDuplicate;
    boolean similarDuplicate;
    Long matchedQuestionId;
    String warningMessage;
}
