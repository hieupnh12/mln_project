package com.sed10.mln.study.utils;

import java.text.Normalizer;
import java.util.Locale;

public final class QuestionContentNormalizer {
    private QuestionContentNormalizer() {}

    public static String normalize(String raw) {
        if (raw == null) {
            return "";
        }
        String normalized = Normalizer.normalize(raw, Normalizer.Form.NFC)
                .toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", " ")
                .trim();
        return normalized.replaceAll("[^\\p{L}\\p{N}\\s]", "");
    }
}
