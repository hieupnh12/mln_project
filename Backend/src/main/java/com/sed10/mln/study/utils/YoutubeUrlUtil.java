package com.sed10.mln.study.utils;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class YoutubeUrlUtil {

    private static final Pattern VIDEO_ID_PATTERN = Pattern.compile(
            "(?:youtube\\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?|shorts)/|.*[?&]v=)|youtu\\.be/)([^\"&?/\\s]{11})",
            Pattern.CASE_INSENSITIVE);

    private YoutubeUrlUtil() {}

    public static boolean isValid(String url) {
        return extractVideoId(url).isPresent();
    }

    public static Optional<String> extractVideoId(String url) {
        if (url == null || url.isBlank()) {
            return Optional.empty();
        }

        Matcher matcher = VIDEO_ID_PATTERN.matcher(url.trim());
        if (matcher.find()) {
            return Optional.of(matcher.group(1));
        }
        return Optional.empty();
    }

    public static String toWatchUrl(String videoId) {
        return "https://www.youtube.com/watch?v=" + videoId;
    }

    public static String toEmbedUrl(String videoId) {
        return "https://www.youtube.com/embed/" + videoId;
    }

    public static String normalize(String url) {
        return extractVideoId(url)
                .map(YoutubeUrlUtil::toWatchUrl)
                .orElseThrow();
    }
}