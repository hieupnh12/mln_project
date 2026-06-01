package com.sed10.mln.study.utils;

import java.text.Normalizer;
import java.util.Locale;

public final class ImportTitleNormalizer {
    private ImportTitleNormalizer() {}

    public static String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        String withoutAccent = Normalizer.normalize(raw, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return withoutAccent
                .toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", " ")
                .trim()
                .replaceAll("[^\\p{L}\\p{N}\\s]", "");
    }

    public static boolean equals(String left, String right) {
        String a = normalize(left);
        String b = normalize(right);
        return !a.isEmpty() && a.equals(b);
    }

    public static boolean compatible(String left, String right) {
        String a = normalize(left);
        String b = normalize(right);
        if (a.isEmpty() || b.isEmpty()) {
            return false;
        }
        return a.equals(b) || a.contains(b) || b.contains(a);
    }
}
