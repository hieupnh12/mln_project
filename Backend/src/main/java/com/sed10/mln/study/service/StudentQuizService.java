package com.sed10.mln.study.service;

import com.sed10.mln.study.constant.AttemptConstant;
import com.sed10.mln.study.constant.QuizConstant;
import com.sed10.mln.study.dto.response.StudentQuizCardResponse;
import com.sed10.mln.study.dto.response.StudentQuizCatalogResponse;
import com.sed10.mln.study.dto.response.StudentQuizCompletedResponse;
import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.entity.Quiz;
import com.sed10.mln.study.entity.QuizAttempt;
import com.sed10.mln.study.entity.Subject;
import com.sed10.mln.study.mapper.QuizMapper;
import com.sed10.mln.study.repository.QuizAttemptRepository;
import com.sed10.mln.study.repository.QuizQuestionRepository;
import com.sed10.mln.study.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudentQuizService {
    private static final DateTimeFormatter DATE_LABEL = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter SUBMITTED_AT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    @Transactional(readOnly = true)
    public StudentQuizCatalogResponse listCatalog(Long subjectId, Long studentId, int completedLimit) {
        int safeCompletedLimit = Math.min(200, Math.max(1, completedLimit));
        LocalDateTime now = LocalDateTime.now();

        List<Quiz> quizzes = quizRepository.findPublishedCatalogBySubjectId(subjectId, QuizConstant.PUBLISHED);
        String subjectTitle = quizzes.stream()
                .map(Quiz::getSubject)
                .filter(subject -> subject != null)
                .map(Subject::getTitle)
                .findFirst()
                .orElse("");

        List<Long> quizIds = quizzes.stream().map(Quiz::getId).toList();
        Map<Long, Long> questionCounts = quizIds.isEmpty()
                ? Map.of()
                : QuizMapper.toCountMap(quizQuestionRepository.countGroupedByQuizIds(quizIds));

        Map<Long, QuizAttempt> latestAttemptByQuiz = new HashMap<>();
        Set<Long> passedQuizIds = new HashSet<>();

        if (studentId != null) {
            List<QuizAttempt> latestAttempts =
                    quizAttemptRepository.findLatestAttemptsPerQuizForStudentAndSubject(studentId, subjectId);
            for (QuizAttempt attempt : latestAttempts) {
                if (attempt.getQuiz() == null) {
                    continue;
                }
                Quiz quiz = attempt.getQuiz();
                latestAttemptByQuiz.put(quiz.getId(), attempt);
                if (isAttemptPassed(attempt, quiz)) {
                    passedQuizIds.add(quiz.getId());
                }
            }
        }

        List<StudentQuizCompletedResponse> completed = new ArrayList<>();
        for (QuizAttempt attempt : latestAttemptByQuiz.values().stream()
                .sorted((a, b) -> {
                    if (a.getAttemptedAt() == null && b.getAttemptedAt() == null) {
                        return 0;
                    }
                    if (a.getAttemptedAt() == null) {
                        return 1;
                    }
                    if (b.getAttemptedAt() == null) {
                        return -1;
                    }
                    return b.getAttemptedAt().compareTo(a.getAttemptedAt());
                })
                .limit(safeCompletedLimit)
                .toList()) {
            Quiz quiz = attempt.getQuiz();
            completed.add(StudentQuizCompletedResponse.builder()
                    .attemptId(AttemptConstant.publicId(attempt.getId()))
                    .quizId(QuizConstant.publicId(quiz.getId()))
                    .title(quiz.getTitle())
                    .submittedAt(formatSubmittedAt(attempt))
                    .scoreLabel(formatScoreLabel(attempt.getScore(), quiz.getPassingScore()))
                    .passed(isAttemptPassed(attempt, quiz))
                    .build());
        }

        List<StudentQuizCardResponse> ongoing = new ArrayList<>();
        List<StudentQuizCardResponse> upcoming = new ArrayList<>();

        for (Quiz quiz : quizzes) {
            if (passedQuizIds.contains(quiz.getId())) {
                continue;
            }

            long questionCount = questionCounts.getOrDefault(quiz.getId(), 0L);
            StudentQuizCardResponse card = toCard(quiz, questionCount);
            CatalogSlot slot = resolveCatalogSlot(quiz, questionCount, now);

            if (slot == CatalogSlot.UPCOMING) {
                upcoming.add(card);
            } else if (slot == CatalogSlot.ONGOING) {
                ongoing.add(card);
            }
        }

        return StudentQuizCatalogResponse.builder()
                .subjectTitle(subjectTitle)
                .ongoing(ongoing)
                .upcoming(upcoming)
                .completed(completed)
                .build();
    }

    private enum CatalogSlot {
        ONGOING,
        UPCOMING,
        HIDDEN
    }

    private CatalogSlot resolveCatalogSlot(Quiz quiz, long questionCount, LocalDateTime now) {
        if (quiz.getAvailableUntil() != null && now.isAfter(quiz.getAvailableUntil())) {
            return CatalogSlot.HIDDEN;
        }
        if (questionCount == 0) {
            return CatalogSlot.UPCOMING;
        }
        if (quiz.getAvailableFrom() != null && now.isBefore(quiz.getAvailableFrom())) {
            return CatalogSlot.UPCOMING;
        }
        return CatalogSlot.ONGOING;
    }

    private boolean isAttemptPassed(QuizAttempt attempt, Quiz quiz) {
        Float score = attempt.getScore();
        if (score == null) {
            return false;
        }
        int passingScore = quiz.getPassingScore() != null ? quiz.getPassingScore() : 70;
        float percent = score <= 10f ? (score / 10f) * 100f : score;
        return percent >= passingScore;
    }

    private StudentQuizCardResponse toCard(Quiz quiz, long questionCount) {
        Chapter chapter = quiz.getChapter();
        Lesson lesson = quiz.getLesson();

        return StudentQuizCardResponse.builder()
                .id(QuizConstant.publicId(quiz.getId()))
                .title(quiz.getTitle())
                .chapter(chapter != null ? chapter.getTitle() : "")
                .lesson(lesson != null ? lesson.getTitle() : "Tất cả bài")
                .questionCount(Math.toIntExact(questionCount))
                .durationMinutes(quiz.getTimeLimit() != null ? quiz.getTimeLimit() : 0)
                .passingScore(quiz.getPassingScore() != null ? quiz.getPassingScore() : 0)
                .scheduleLabel(formatScheduleLabel(quiz))
                .icon(resolveIcon(quiz))
                .build();
    }

    private String formatScheduleLabel(Quiz quiz) {
        LocalDateTime now = LocalDateTime.now();
        if (quiz.getAvailableFrom() != null && now.isBefore(quiz.getAvailableFrom())) {
            return "Mở từ " + quiz.getAvailableFrom().toLocalDate().format(DATE_LABEL);
        }
        if (quiz.getAvailableUntil() != null) {
            return "Đến " + quiz.getAvailableUntil().toLocalDate().format(DATE_LABEL);
        }
        if (quiz.getUpdatedAt() != null) {
            return quiz.getUpdatedAt().toLocalDate().format(DATE_LABEL);
        }
        if (quiz.getCreatedAt() != null) {
            return quiz.getCreatedAt().toLocalDate().format(DATE_LABEL);
        }
        return "";
    }

    private String formatSubmittedAt(QuizAttempt attempt) {
        if (attempt.getAttemptedAt() == null) {
            return "";
        }
        return attempt.getAttemptedAt().format(SUBMITTED_AT);
    }

    private String formatScoreLabel(Float score, Integer passingScore) {
        if (score == null) {
            return "—";
        }
        if (score <= 10f) {
            return String.format("%.1f/10", score);
        }
        int pass = passingScore != null ? passingScore : 0;
        return String.format("%.0f%% (đạt %d%%)", score, pass);
    }

    private String resolveIcon(Quiz quiz) {
        if (quiz.getLesson() != null) {
            return "menu_book";
        }
        if (quiz.getChapter() != null) {
            return "auto_stories";
        }
        return "quiz";
    }
}
