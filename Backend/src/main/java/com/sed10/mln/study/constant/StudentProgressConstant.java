package com.sed10.mln.study.constant;

import java.util.Set;

public final class StudentProgressConstant {
    private StudentProgressConstant() {}

    public static final String NOT_STARTED = "NOT_STARTED";
    public static final String IN_PROGRESS = "IN_PROGRESS";
    public static final String COMPLETED = "COMPLETED";

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            NOT_STARTED,
            IN_PROGRESS,
            COMPLETED
    );

    public static boolean isValidStatus(String status) {
        return status != null && ALLOWED_STATUSES.contains(status.trim().toUpperCase());
    }

    public static String normalizeStatus(String status) {
        return status.trim().toUpperCase();
    }
}
