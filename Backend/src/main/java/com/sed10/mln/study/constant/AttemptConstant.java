package com.sed10.mln.study.constant;

public final class AttemptConstant {
    private AttemptConstant() {}

    public static String publicId(Long id) {
        return "AT-" + id;
    }

    public static Long parseId(String rawId) {
        if (rawId == null || rawId.isBlank()) {
            return null;
        }
        String normalized = rawId.trim();
        if (normalized.startsWith("AT-")) {
            normalized = normalized.substring(3);
        }
        return Long.valueOf(normalized);
    }
}
