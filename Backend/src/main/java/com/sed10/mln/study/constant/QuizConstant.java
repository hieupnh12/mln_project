package com.sed10.mln.study.constant;

import java.util.Map;

public final class QuizConstant {
    public static final String DRAFT = "DRAFT";
    public static final String PUBLISHED = "PUBLISHED";

    private static final Map<String, String> TO_LABEL = Map.of(
            DRAFT, "Bản nháp",
            PUBLISHED, "Đã xuất bản");

    private static final Map<String, String> FROM_LABEL = Map.of(
            "Bản nháp", DRAFT,
            "Đã xuất bản", PUBLISHED);

    private QuizConstant() {}

    public static String toLabel(String code) {
        return TO_LABEL.getOrDefault(code, code);
    }

    public static String fromLabel(String label) {
        if (label == null || label.isBlank() || "all".equalsIgnoreCase(label)) {
            return DRAFT;
        }
        return FROM_LABEL.getOrDefault(label.trim(), label.trim().toUpperCase());
    }

    public static String publicId(Long id) {
        return "QZ-" + id;
    }

    public static Long parseId(String rawId) {
        if (rawId == null || rawId.isBlank()) {
            return null;
        }
        String normalized = rawId.trim();
        if (normalized.startsWith("QZ-")) {
            normalized = normalized.substring(3);
        }
        return Long.valueOf(normalized);
    }
}
