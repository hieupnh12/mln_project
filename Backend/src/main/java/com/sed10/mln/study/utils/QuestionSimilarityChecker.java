package com.sed10.mln.study.utils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public final class QuestionSimilarityChecker {
    public static final double SIMILARITY_THRESHOLD = 0.80;

    private QuestionSimilarityChecker() {}

    public static double jaccardSimilarity(String left, String right) {
        Set<String> leftTokens = tokenize(left);
        Set<String> rightTokens = tokenize(right);
        if (leftTokens.isEmpty() && rightTokens.isEmpty()) {
            return 1.0;
        }
        if (leftTokens.isEmpty() || rightTokens.isEmpty()) {
            return 0.0;
        }
        Set<String> intersection = new HashSet<>(leftTokens);
        intersection.retainAll(rightTokens);
        Set<String> union = new HashSet<>(leftTokens);
        union.addAll(rightTokens);
        return (double) intersection.size() / union.size();
    }

    public static boolean isSimilar(String left, String right) {
        return jaccardSimilarity(left, right) >= SIMILARITY_THRESHOLD;
    }

    private static Set<String> tokenize(String value) {
        return new HashSet<>(Arrays.asList(QuestionContentNormalizer.normalize(value).split(" ")));
    }
}
