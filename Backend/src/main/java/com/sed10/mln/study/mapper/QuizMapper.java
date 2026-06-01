package com.sed10.mln.study.mapper;

import com.sed10.mln.study.constant.QuizConstant;
import com.sed10.mln.study.dto.response.QuizDetailResponse;
import com.sed10.mln.study.dto.response.QuizListItemResponse;
import com.sed10.mln.study.dto.response.QuestionResponse;
import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.entity.Quiz;
import com.sed10.mln.study.entity.Subject;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class QuizMapper {
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;

    private final QuestionMapper questionMapper;

    public QuizListItemResponse toListItemResponse(
            Quiz quiz, long questionCount, long attemptCount) {
        Subject subject = quiz.getSubject();
        Chapter chapter = quiz.getChapter();
        Lesson lesson = quiz.getLesson();

        return QuizListItemResponse.builder()
                .id(QuizConstant.publicId(quiz.getId()))
                .title(quiz.getTitle())
                .course(subject != null ? subject.getTitle() : "")
                .chapter(chapter != null ? chapter.getTitle() : "")
                .lesson(lesson != null ? lesson.getTitle() : "Tất cả bài")
                .questionCount(Math.toIntExact(questionCount))
                .duration(quiz.getTimeLimit() != null ? quiz.getTimeLimit() : 0)
                .passingScore(quiz.getPassingScore() != null ? quiz.getPassingScore() : 0)
                .status(QuizConstant.toLabel(quiz.getStatus()))
                .updatedAt(formatDate(quiz.getUpdatedAt()))
                .createdAt(formatDate(quiz.getCreatedAt()))
                .attemptCount(attemptCount)
                .build();
    }

    public QuizDetailResponse toDetailResponse(
            Quiz quiz,
            List<String> questionIds,
            List<QuestionResponse> questions,
            long attemptCount) {
        Subject subject = quiz.getSubject();
        Chapter chapter = quiz.getChapter();
        Lesson lesson = quiz.getLesson();

        return QuizDetailResponse.builder()
                .id(QuizConstant.publicId(quiz.getId()))
                .title(quiz.getTitle())
                .course(subject != null ? subject.getTitle() : "")
                .chapter(chapter != null ? chapter.getTitle() : "")
                .lesson(lesson != null ? lesson.getTitle() : "all")
                .duration(quiz.getTimeLimit() != null ? quiz.getTimeLimit() : 0)
                .passingScore(quiz.getPassingScore() != null ? quiz.getPassingScore() : 0)
                .randomCount(quiz.getRandomQuestionCount() != null ? quiz.getRandomQuestionCount() : 0)
                .shuffleAnswers(Boolean.TRUE.equals(quiz.getShuffleAnswers()))
                .randomQuestions(Boolean.TRUE.equals(quiz.getRandomQuestions()))
                .status(QuizConstant.toLabel(quiz.getStatus()))
                .updatedAt(formatDate(quiz.getUpdatedAt()))
                .createdAt(formatDate(quiz.getCreatedAt()))
                .attemptCount(attemptCount)
                .questionCount(questionIds.size())
                .questionIds(questionIds)
                .questions(questions)
                .build();
    }

    public static Map<Long, Long> toCountMap(List<Object[]> rows) {
        return rows.stream()
                .collect(java.util.stream.Collectors.toMap(
                        row -> ((Number) row[0]).longValue(),
                        row -> ((Number) row[1]).longValue()));
    }

    private String formatDate(java.time.LocalDateTime value) {
        return value != null ? value.toLocalDate().format(DATE_FORMAT) : "";
    }
}
