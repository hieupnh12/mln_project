package com.sed10.mln.study.constant;

import java.util.Map;

public final class QuestionConstant {
    public static final String DRAFT = "DRAFT";
    public static final String PENDING = "PENDING";
    public static final String PUBLISHED = "PUBLISHED";

    /** Answers at or above this sort order are archived (kept for quiz history, hidden in UI). */
    public static final int HIDDEN_ANSWER_SORT_ORDER_BASE = 100;

    private static final Map<String, String> TO_LABEL = Map.of(
            DRAFT, "Bản nháp",
            PENDING, "Cần duyệt",
            PUBLISHED, "Đã xuất bản");

    private static final Map<String, String> FROM_LABEL = Map.of(
            "Bản nháp", DRAFT,
            "Cần duyệt", PENDING,
            "Đã xuất bản", PUBLISHED);

    private QuestionConstant() {}

    public static String toLabel(String code) {
        return TO_LABEL.getOrDefault(code, code);
    }

    public static String fromLabel(String label) {
        if (label == null || label.isBlank()) {
            return DRAFT;
        }
        return FROM_LABEL.getOrDefault(label.trim(), label.trim().toUpperCase());
    }
}
