package com.sed10.mln.study.service;

import com.sed10.mln.study.constant.QuestionConstant;
import com.sed10.mln.study.constant.QuizConstant;
import com.sed10.mln.study.dto.request.SaveQuizRequest;
import com.sed10.mln.study.dto.response.QuestionListResponse;
import com.sed10.mln.study.dto.response.QuestionResponse;
import com.sed10.mln.study.dto.response.QuizDetailResponse;
import com.sed10.mln.study.dto.response.QuizListItemResponse;
import com.sed10.mln.study.dto.response.QuizListResponse;
import com.sed10.mln.study.dto.response.QuizStatsResponse;
import com.sed10.mln.study.entity.*;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.mapper.QuestionMapper;
import com.sed10.mln.study.mapper.QuizMapper;
import com.sed10.mln.study.repository.*;
import com.sed10.mln.study.repository.specification.QuizSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizManagementService {
    private static final int MAX_PAGE_SIZE = 100;

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final QuestionLibraryService questionLibraryService;
    private final QuizMapper quizMapper;
    private final QuestionMapper questionMapper;

    @Transactional(readOnly = true)
    public QuizListResponse listQuizzes(String search, String course, String status, int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), MAX_PAGE_SIZE);
        Page<Quiz> result = quizRepository.findAll(
                QuizSpecification.withFilters(search, course, status),
                PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "updatedAt")));

        List<Long> quizIds = result.getContent().stream().map(Quiz::getId).toList();
        Map<Long, Long> questionCounts = quizIds.isEmpty()
                ? Collections.emptyMap()
                : QuizMapper.toCountMap(quizQuestionRepository.countGroupedByQuizIds(quizIds));
        Map<Long, Long> attemptCounts = quizIds.isEmpty()
                ? Collections.emptyMap()
                : QuizMapper.toCountMap(quizAttemptRepository.countGroupedByQuizIds(quizIds));

        List<QuizListItemResponse> items = result.getContent().stream()
                .map(quiz -> quizMapper.toListItemResponse(
                        quiz,
                        questionCounts.getOrDefault(quiz.getId(), 0L),
                        attemptCounts.getOrDefault(quiz.getId(), 0L)))
                .toList();

        return QuizListResponse.builder()
                .items(items)
                .total(result.getTotalElements())
                .page(safePage)
                .size(safeSize)
                .build();
    }

    @Transactional(readOnly = true)
    public QuizStatsResponse getStats() {
        List<Quiz> quizzes = quizRepository.findAll();
        int draftCount = 0;
        int publishedCount = 0;
        int totalDuration = 0;
        int totalQuestions = 0;

        for (Quiz quiz : quizzes) {
            if (QuizConstant.PUBLISHED.equals(quiz.getStatus())) {
                publishedCount++;
            } else {
                draftCount++;
            }
            totalDuration += quiz.getTimeLimit() != null ? quiz.getTimeLimit() : 0;
            totalQuestions += quizQuestionRepository.countByQuiz_Id(quiz.getId());
        }

        int avgDuration = quizzes.isEmpty() ? 0 : Math.round((float) totalDuration / quizzes.size());

        return QuizStatsResponse.builder()
                .total(quizzes.size())
                .draftCount(draftCount)
                .publishedCount(publishedCount)
                .totalQuestions(totalQuestions)
                .avgDuration(avgDuration)
                .build();
    }

    @Transactional(readOnly = true)
    public QuizDetailResponse getQuiz(Long id) {
        Quiz quiz = getQuizEntity(id);
        List<QuizQuestion> links = quizQuestionRepository.findByQuiz_IdOrderBySortOrderAsc(id);
        List<String> questionIds = new ArrayList<>();
        List<QuestionResponse> questions = new ArrayList<>();

        for (QuizQuestion link : links) {
            Question question = link.getQuestion();
            questionIds.add("Q-" + question.getId());
            questions.add(questionMapper.toResponse(question));
        }

        long attemptCount = quizAttemptRepository.countByQuiz_Id(id);
        return quizMapper.toDetailResponse(quiz, questionIds, questions, attemptCount);
    }

    @Transactional(readOnly = true)
    public QuestionListResponse listCandidateQuestions(
            String search,
            String course,
            String chapter,
            String lesson,
            String difficulty,
            int page,
            int size) {
        return questionLibraryService.listQuestions(
                search,
                course,
                chapter,
                lesson,
                difficulty,
                "all",
                QuestionConstant.toLabel(QuestionConstant.PUBLISHED),
                page,
                size);
    }

    @Transactional
    public QuizDetailResponse createQuiz(SaveQuizRequest request) {
        User teacher = com.sed10.mln.study.security.SecurityUtils.getCurrentUser();
        QuizScope scope = resolveScope(request.getCourse(), request.getChapter(), request.getLesson());
        LocalDateTime now = LocalDateTime.now();

        Quiz quiz = Quiz.builder()
                .title(normalizeTitle(request.getTitle()))
                .timeLimit(safeDuration(request.getDuration()))
                .passingScore(safePassingScore(request.getPassingScore()))
                .status(QuizConstant.DRAFT)
                .shuffleAnswers(request.getShuffleAnswers() == null || request.getShuffleAnswers())
                .randomQuestions(Boolean.TRUE.equals(request.getRandomQuestions()))
                .randomQuestionCount(request.getRandomCount())
                .subject(scope.subject())
                .chapter(scope.chapter())
                .lesson(scope.lesson())
                .createdBy(teacher)
                .createdAt(now)
                .updatedAt(now)
                .availableFrom(parseDateTime(request.getAvailableFrom()))
                .availableUntil(parseDateTime(request.getAvailableUntil()))
                .build();

        quiz = quizRepository.save(quiz);
        replaceQuizQuestions(quiz, request.getQuestionIds());
        return buildSavedQuizResponse(quiz, request.getQuestionIds());
    }

    @Transactional
    public QuizDetailResponse updateQuiz(Long id, SaveQuizRequest request) {
        Quiz quiz = getQuizEntity(id);
        QuizScope scope = resolveScope(request.getCourse(), request.getChapter(), request.getLesson());

        quiz.setTitle(normalizeTitle(request.getTitle()));
        quiz.setTimeLimit(safeDuration(request.getDuration()));
        quiz.setPassingScore(safePassingScore(request.getPassingScore()));
        quiz.setShuffleAnswers(request.getShuffleAnswers() == null || request.getShuffleAnswers());
        quiz.setRandomQuestions(Boolean.TRUE.equals(request.getRandomQuestions()));
        quiz.setRandomQuestionCount(request.getRandomCount());
        quiz.setSubject(scope.subject());
        quiz.setChapter(scope.chapter());
        quiz.setLesson(scope.lesson());
        quiz.setAvailableFrom(parseDateTime(request.getAvailableFrom()));
        quiz.setAvailableUntil(parseDateTime(request.getAvailableUntil()));
        quiz.setUpdatedAt(LocalDateTime.now());

        quizRepository.save(quiz);
        replaceQuizQuestions(quiz, request.getQuestionIds());
        return buildSavedQuizResponse(quiz, request.getQuestionIds());
    }

    @Transactional
    public QuizDetailResponse publishQuiz(Long id) {
        Quiz quiz = getQuizEntity(id);
        long questionCount = quizQuestionRepository.countByQuiz_Id(id);
        validatePublishable(quiz.getTitle(), questionCount, quiz.getTimeLimit(), quiz.getPassingScore());

        quiz.setStatus(QuizConstant.PUBLISHED);
        quiz.setUpdatedAt(LocalDateTime.now());
        quizRepository.save(quiz);
        return getQuiz(id);
    }

    @Transactional
    public QuizDetailResponse duplicateQuiz(Long id) {
        Quiz source = getQuizEntity(id);
        User teacher = com.sed10.mln.study.security.SecurityUtils.getCurrentUser();
        LocalDateTime now = LocalDateTime.now();

        Quiz copy = Quiz.builder()
                .title(source.getTitle() + " (bản sao)")
                .timeLimit(source.getTimeLimit())
                .passingScore(source.getPassingScore())
                .status(QuizConstant.DRAFT)
                .shuffleAnswers(source.getShuffleAnswers())
                .randomQuestions(source.getRandomQuestions())
                .randomQuestionCount(source.getRandomQuestionCount())
                .subject(source.getSubject())
                .chapter(source.getChapter())
                .lesson(source.getLesson())
                .createdBy(teacher)
                .createdAt(now)
                .updatedAt(now)
                .availableFrom(source.getAvailableFrom())
                .availableUntil(source.getAvailableUntil())
                .build();
        copy = quizRepository.save(copy);

        List<QuizQuestion> links = quizQuestionRepository.findByQuiz_IdOrderBySortOrderAsc(id);
        int order = 1;
        for (QuizQuestion link : links) {
            quizQuestionRepository.save(QuizQuestion.builder()
                    .id(QuizQuestionId.builder()
                            .quizId(copy.getId())
                            .questionId(link.getQuestion().getId())
                            .build())
                    .quiz(copy)
                    .question(link.getQuestion())
                    .sortOrder(order++)
                    .points(link.getPoints())
                    .build());
        }

        return getQuiz(copy.getId());
    }

    @Transactional
    public void closeQuiz(Long id) {
        Quiz quiz = getQuizEntity(id);
        if (!QuizConstant.PUBLISHED.equals(quiz.getStatus())) {
            throw new AppException(ErrorCode.QUIZ_CLOSE_INVALID);
        }
        quiz.setStatus(QuizConstant.CLOSED);
        quiz.setUpdatedAt(LocalDateTime.now());
        quizRepository.save(quiz);
    }

    @Transactional
    public void deleteQuiz(Long id) {
        Quiz quiz = getQuizEntity(id);
        if (!QuizConstant.DRAFT.equals(quiz.getStatus())) {
            throw new AppException(ErrorCode.QUIZ_DELETE_NOT_ALLOWED);
        }
        quizQuestionRepository.deleteByQuiz_Id(id);
        quizRepository.delete(quiz);
    }

    private Quiz getQuizEntity(Long id) {
        return quizRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.QUIZ_NOT_FOUND));
    }

    private void replaceQuizQuestions(Quiz quiz, List<String> rawQuestionIds) {
        quizQuestionRepository.deleteByQuiz_Id(quiz.getId());
        if (rawQuestionIds == null || rawQuestionIds.isEmpty()) {
            return;
        }

        List<Long> questionIds = rawQuestionIds.stream().map(this::parseQuestionId).toList();
        Map<Long, Question> questionMap = questionRepository.findAllById(questionIds).stream()
                .collect(Collectors.toMap(Question::getId, Function.identity(), (left, right) -> left, LinkedHashMap::new));

        List<QuizQuestion> links = new ArrayList<>(questionIds.size());
        int order = 1;
        for (Long questionId : questionIds) {
            Question question = questionMap.get(questionId);
            if (question == null) {
                throw new AppException(ErrorCode.QUESTION_NOT_FOUND);
            }

            links.add(QuizQuestion.builder()
                    .id(QuizQuestionId.builder()
                            .quizId(quiz.getId())
                            .questionId(questionId)
                            .build())
                    .quiz(quiz)
                    .question(question)
                    .sortOrder(order++)
                    .points(question.getScore())
                    .build());
        }

        quizQuestionRepository.saveAll(links);
    }

    private QuizDetailResponse buildSavedQuizResponse(Quiz quiz, List<String> rawQuestionIds) {
        List<String> questionIds = rawQuestionIds == null ? List.of() : rawQuestionIds;
        long attemptCount = quizAttemptRepository.countByQuiz_Id(quiz.getId());
        return quizMapper.toDetailResponse(quiz, questionIds, Collections.emptyList(), attemptCount);
    }

    private record QuizScope(Subject subject, Chapter chapter, Lesson lesson) {}

    private QuizScope resolveScope(String course, String chapterTitle, String lessonTitle) {
        if (course == null || course.isBlank()) {
            throw new AppException(ErrorCode.QUIZ_SCOPE_INVALID);
        }

        Subject subject = subjectRepository.findFirstByTitle(course)
                .orElseThrow(() -> new AppException(ErrorCode.QUIZ_SCOPE_INVALID));

        Chapter chapter = null;
        if (chapterTitle != null
                && !chapterTitle.isBlank()
                && !"all".equalsIgnoreCase(chapterTitle)
                && !"Tất cả".equalsIgnoreCase(chapterTitle)) {
            chapter = chapterRepository.findFirstBySubject_IdAndTitle(subject.getId(), chapterTitle)
                    .orElseThrow(() -> new AppException(ErrorCode.QUIZ_SCOPE_INVALID));
        }

        Lesson lesson = null;
        if (lessonTitle != null
                && !lessonTitle.isBlank()
                && !"all".equalsIgnoreCase(lessonTitle)
                && !"Tất cả".equalsIgnoreCase(lessonTitle)
                && !"Tất cả bài".equalsIgnoreCase(lessonTitle)) {
            lesson = chapter != null
                    ? lessonRepository.findFirstByChapter_IdAndTitle(chapter.getId(), lessonTitle)
                            .orElseThrow(() -> new AppException(ErrorCode.QUIZ_SCOPE_INVALID))
                    : lessonRepository.findFirstBySubjectIdAndTitle(subject.getId(), lessonTitle)
                            .orElseThrow(() -> new AppException(ErrorCode.QUIZ_SCOPE_INVALID));
        }

        return new QuizScope(subject, chapter, lesson);
    }

    private LocalDateTime parseDateTime(String rawValue) {
        if (rawValue == null || rawValue.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(rawValue.trim());
        } catch (DateTimeParseException ignored) {
            try {
                return java.time.LocalDate.parse(rawValue.trim()).atTime(23, 59, 59);
            } catch (DateTimeParseException ex) {
                throw new AppException(ErrorCode.QUIZ_SCOPE_INVALID);
            }
        }
    }

    private void validatePublishable(String title, long questionCount, Integer duration, Integer passingScore) {
        if (title == null || title.trim().length() < 3) {
            throw new AppException(ErrorCode.QUIZ_PUBLISH_INVALID);
        }
        if (questionCount < 1) {
            throw new AppException(ErrorCode.QUIZ_PUBLISH_INVALID);
        }
        if (duration == null || duration < 5) {
            throw new AppException(ErrorCode.QUIZ_PUBLISH_INVALID);
        }
        if (passingScore == null || passingScore < 1 || passingScore > 100) {
            throw new AppException(ErrorCode.QUIZ_PUBLISH_INVALID);
        }
    }

    private String normalizeTitle(String title) {
        if (title == null || title.isBlank()) {
            return "Quiz mới";
        }
        return title.trim();
    }

    private int safeDuration(Integer duration) {
        return duration == null ? 20 : Math.max(5, duration);
    }

    private int safePassingScore(Integer passingScore) {
        return passingScore == null ? 70 : Math.min(100, Math.max(1, passingScore));
    }

    private Long parseQuestionId(String rawId) {
        if (rawId == null || rawId.isBlank()) {
            throw new AppException(ErrorCode.QUESTION_NOT_FOUND);
        }
        String normalized = rawId.trim();
        if (normalized.startsWith("Q-")) {
            normalized = normalized.substring(2);
        }
        return Long.valueOf(normalized);
    }
}
