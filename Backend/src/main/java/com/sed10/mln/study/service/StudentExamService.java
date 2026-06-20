package com.sed10.mln.study.service;

import com.sed10.mln.study.constant.AttemptConstant;
import com.sed10.mln.study.constant.QuestionConstant;
import com.sed10.mln.study.constant.QuizConstant;
import com.sed10.mln.study.dto.request.SubmitExamAnswerRequest;
import com.sed10.mln.study.dto.request.SubmitExamRequest;
import com.sed10.mln.study.dto.response.StudentExamDifficultySliceResponse;
import com.sed10.mln.study.dto.response.StudentExamImproveTopicResponse;
import com.sed10.mln.study.dto.response.StudentExamOptionResponse;
import com.sed10.mln.study.dto.response.StudentExamQuestionResponse;
import com.sed10.mln.study.dto.response.StudentExamReviewOptionResponse;
import com.sed10.mln.study.dto.response.StudentExamReviewQuestionResponse;
import com.sed10.mln.study.dto.response.StudentExamReviewResponse;
import com.sed10.mln.study.dto.response.StudentExamSessionResponse;
import com.sed10.mln.study.dto.response.StudentExamSummaryResponse;
import com.sed10.mln.study.dto.response.SubmitExamResponse;
import com.sed10.mln.study.entity.Answer;
import com.sed10.mln.study.entity.Lesson;
import com.sed10.mln.study.entity.Question;
import com.sed10.mln.study.entity.Quiz;
import com.sed10.mln.study.entity.QuizAttempt;
import com.sed10.mln.study.entity.QuizAttemptDetail;
import com.sed10.mln.study.entity.QuizAttemptQuestion;
import com.sed10.mln.study.entity.QuizQuestion;
import com.sed10.mln.study.entity.Subject;
import com.sed10.mln.study.entity.User;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.repository.AnswerRepository;
import com.sed10.mln.study.repository.QuizAttemptDetailRepository;
import com.sed10.mln.study.repository.QuizAttemptQuestionRepository;
import com.sed10.mln.study.repository.QuizAttemptRepository;
import com.sed10.mln.study.repository.QuizQuestionRepository;
import com.sed10.mln.study.repository.QuizRepository;
import com.sed10.mln.study.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentExamService {
    private static final String[] OPTION_LABELS = {"A", "B", "C", "D", "E", "F", "G", "H"};
    private static final DateTimeFormatter SUBMITTED_AT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final List<String> DIFFICULTY_ORDER = List.of("Cơ bản", "Vận dụng", "Nâng cao");

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final AnswerRepository answerRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizAttemptDetailRepository quizAttemptDetailRepository;
    private final QuizAttemptQuestionRepository quizAttemptQuestionRepository;
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public StudentExamSessionResponse getSession(Long subjectId, Long quizId) {
        Quiz quiz = getPublishedQuizForSubject(subjectId, quizId);
        List<StudentExamQuestionResponse> questions = buildExamQuestions(quiz);
        if (questions.isEmpty()) {
            throw new AppException(ErrorCode.QUIZ_PUBLISH_INVALID);
        }

        Subject subject = quiz.getSubject();
        return StudentExamSessionResponse.builder()
                .quizId(QuizConstant.publicId(quiz.getId()))
                .title(quiz.getTitle())
                .courseTitle(subject != null ? subject.getTitle() : "")
                .durationMinutes(quiz.getTimeLimit() != null ? quiz.getTimeLimit() : 45)
                .passingScore(quiz.getPassingScore() != null ? quiz.getPassingScore() : 70)
                .questionCount(questions.size())
                .questions(questions)
                .build();
    }

    @Transactional
    public SubmitExamResponse submitExam(Long subjectId, Long quizId, SubmitExamRequest request) {
        Quiz quiz = getPublishedQuizForSubject(subjectId, quizId);
        User student = resolveStudent(request.getStudentId());

        Map<Long, List<Long>> selectedByQuestion = parseSelectedAnswers(request.getAnswers());
        List<Question> sessionQuestions = resolveSessionQuestions(quiz, request.getQuestionIds());
        if (sessionQuestions.isEmpty()) {
            throw new AppException(ErrorCode.QUIZ_PUBLISH_INVALID);
        }

        int elapsedSeconds = request.getElapsedSeconds() != null ? Math.max(0, request.getElapsedSeconds()) : 0;
        LocalDateTime now = LocalDateTime.now();

        QuizAttempt attempt = QuizAttempt.builder()
                .student(student)
                .quiz(quiz)
                .attemptedAt(now)
                .elapsedSeconds(elapsedSeconds)
                .build();
        attempt = quizAttemptRepository.save(attempt);

        persistAttemptQuestionsBatch(attempt.getId(), sessionQuestions);

        Map<Long, List<Answer>> answersByQuestion = loadAnswersByQuestion(sessionQuestions);
        AttemptGrade grade = gradeQuestions(sessionQuestions, selectedByQuestion, answersByQuestion);
        persistAttemptDetailsBatch(attempt.getId(), selectedByQuestion);

        float scoreOnTen = grade.total() == 0 ? 0f : ((float) grade.correct() / grade.total()) * 10f;
        attempt.setScore(scoreOnTen);
        quizAttemptRepository.save(attempt);

        int passingScore = resolvePassingScore(quiz);
        boolean passed = grade.accuracyPercent() >= passingScore;

        StudentExamSummaryResponse summary = buildExamSummary(
                quiz,
                AttemptConstant.publicId(attempt.getId()),
                grade,
                scoreOnTen,
                passingScore,
                passed,
                elapsedSeconds,
                now);

        return SubmitExamResponse.builder()
                .attemptId(AttemptConstant.publicId(attempt.getId()))
                .quizId(QuizConstant.publicId(quiz.getId()))
                .scoreLabel(String.format("%.1f/10", scoreOnTen))
                .passed(passed)
                .correctCount(grade.correct())
                .totalQuestions(grade.total())
                .summary(summary)
                .build();
    }

    @Transactional(readOnly = true)
    public StudentExamSummaryResponse getAttemptSummary(Long subjectId, Long attemptId, Long studentId) {
        QuizAttempt attempt = loadAuthorizedAttempt(subjectId, attemptId, studentId);
        Quiz quiz = attempt.getQuiz();

        Map<Long, List<Long>> selectedByQuestion = loadSelectedByQuestion(attemptId);
        List<Question> sessionQuestions = loadAttemptQuestions(attempt, quiz);
        Map<Long, List<Answer>> answersByQuestion = loadAnswersByQuestion(sessionQuestions);
        AttemptGrade grade = gradeQuestions(sessionQuestions, selectedByQuestion, answersByQuestion);

        float scoreValue = attempt.getScore() != null ? attempt.getScore() : 0f;
        int passingScore = resolvePassingScore(quiz);
        int elapsedSeconds = resolveElapsedSeconds(attempt, quiz);

        return buildExamSummary(
                quiz,
                AttemptConstant.publicId(attempt.getId()),
                grade,
                scoreValue,
                passingScore,
                grade.accuracyPercent() >= passingScore,
                elapsedSeconds,
                attempt.getAttemptedAt());
    }

    @Transactional(readOnly = true)
    public StudentExamReviewResponse getAttemptReview(Long subjectId, Long attemptId, Long studentId) {
        QuizAttempt attempt = loadAuthorizedAttempt(subjectId, attemptId, studentId);
        Quiz quiz = attempt.getQuiz();

        Map<Long, List<Long>> selectedByQuestion = loadSelectedByQuestion(attemptId);
        List<Question> sessionQuestions = loadAttemptQuestions(attempt, quiz);
        Map<Long, List<Answer>> answersByQuestion = loadAnswersByQuestion(sessionQuestions);

        List<StudentExamReviewQuestionResponse> questions = new ArrayList<>();
        int index = 1;
        int correctCount = 0;

        for (Question question : sessionQuestions) {
            List<Long> selectedAnswerIds =
                    selectedByQuestion.getOrDefault(question.getId(), List.of());
            List<Answer> answers = filterVisibleAnswers(
                    answersByQuestion.getOrDefault(question.getId(), List.of()));

            boolean questionCorrect = isQuestionAnswerCorrect(question, answers, selectedAnswerIds);
            if (questionCorrect) {
                correctCount++;
            }

            List<StudentExamReviewOptionResponse> options = new ArrayList<>();
            for (int i = 0; i < answers.size(); i++) {
                Answer answer = answers.get(i);
                options.add(StudentExamReviewOptionResponse.builder()
                        .answerId(answer.getId())
                        .label(i < OPTION_LABELS.length ? OPTION_LABELS[i] : String.valueOf(i + 1))
                        .content(answer.getContent())
                        .state(resolveReviewOptionState(answer, selectedAnswerIds))
                        .build());
            }

            String explanation = question.getExplanation();
            if (explanation == null || explanation.isBlank()) {
                explanation = "Chưa có giải thích cho câu hỏi này.";
            }

            questions.add(StudentExamReviewQuestionResponse.builder()
                    .index(index++)
                    .id("Q-" + question.getId())
                    .question(question.getContent())
                    .correct(questionCorrect)
                    .explanation(explanation)
                    .options(options)
                    .build());
        }

        int total = questions.size();
        float scoreValue = attempt.getScore() != null ? attempt.getScore() : 0f;
        int scorePercent = scoreValue <= 10f ? Math.round(scoreValue * 10f) : Math.round(scoreValue);
        int passingScore = resolvePassingScore(quiz);
        float percent = total == 0 ? 0f : ((float) correctCount / total) * 100f;

        Subject subject = quiz.getSubject();
        return StudentExamReviewResponse.builder()
                .attemptId(AttemptConstant.publicId(attempt.getId()))
                .quizId(QuizConstant.publicId(quiz.getId()))
                .quizTitle(quiz.getTitle())
                .courseTitle(subject != null ? subject.getTitle() : "")
                .scoreLabel(formatScoreLabel(scoreValue, passingScore))
                .scorePercent(scorePercent)
                .correctCount(correctCount)
                .totalQuestions(total)
                .passed(percent >= passingScore)
                .submittedAt(formatSubmittedAt(attempt.getAttemptedAt()))
                .questions(questions)
                .build();
    }

    private Map<Long, List<Answer>> loadAnswersByQuestion(List<Question> questions) {
        Set<Long> questionIds = questions.stream()
                .map(Question::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        if (questionIds.isEmpty()) {
            return Map.of();
        }

        return answerRepository
                .findByQuestion_IdInOrderByQuestion_IdAscSortOrderAsc(questionIds)
                .stream()
                .filter(answer -> answer.getQuestion() != null)
                .collect(Collectors.groupingBy(
                        answer -> answer.getQuestion().getId(),
                        LinkedHashMap::new,
                        Collectors.toList()));
    }

    private QuizAttempt loadAuthorizedAttempt(Long subjectId, Long attemptId, Long studentId) {
        User student = resolveStudent(studentId);
        QuizAttempt attempt = quizAttemptRepository
                .findById(attemptId)
                .orElseThrow(() -> new AppException(ErrorCode.QUIZ_NOT_FOUND));

        if (attempt.getStudent() == null || !student.getId().equals(attempt.getStudent().getId())) {
            throw new AppException(ErrorCode.QUIZ_NOT_FOUND);
        }

        Quiz quiz = attempt.getQuiz();
        if (quiz == null
                || quiz.getSubject() == null
                || !quiz.getSubject().getId().equals(subjectId)) {
            throw new AppException(ErrorCode.QUIZ_SCOPE_INVALID);
        }
        return attempt;
    }

    private Map<Long, List<Long>> parseSelectedAnswers(List<SubmitExamAnswerRequest> answers) {
        Map<Long, List<Long>> selectedByQuestion = new LinkedHashMap<>();
        if (answers == null) {
            return selectedByQuestion;
        }
        for (SubmitExamAnswerRequest item : answers) {
            if (item.getQuestionId() == null || item.getAnswerId() == null) {
                continue;
            }
            Long questionId = parseQuestionId(item.getQuestionId());
            selectedByQuestion.computeIfAbsent(questionId, key -> new ArrayList<>());
            List<Long> selected = selectedByQuestion.get(questionId);
            if (!selected.contains(item.getAnswerId())) {
                selected.add(item.getAnswerId());
            }
        }
        return selectedByQuestion;
    }

    private Map<Long, List<Long>> loadSelectedByQuestion(Long attemptId) {
        Map<Long, List<Long>> selectedByQuestion = new LinkedHashMap<>();
        for (QuizAttemptDetail detail :
                quizAttemptDetailRepository.findByAttempt_IdOrderByIdAsc(attemptId)) {
            if (detail.getQuestion() != null && detail.getSelectedAnswer() != null) {
                Long questionId = detail.getQuestion().getId();
                selectedByQuestion.computeIfAbsent(questionId, key -> new ArrayList<>());
                Long answerId = detail.getSelectedAnswer().getId();
                List<Long> selected = selectedByQuestion.get(questionId);
                if (!selected.contains(answerId)) {
                    selected.add(answerId);
                }
            }
        }
        return selectedByQuestion;
    }

    private AttemptGrade gradeQuestions(
            List<Question> sessionQuestions,
            Map<Long, List<Long>> selectedByQuestion,
            Map<Long, List<Answer>> answersByQuestion) {
        int correct = 0;
        Map<String, int[]> difficultyStats = new LinkedHashMap<>();
        Map<String, int[]> chapterStats = new LinkedHashMap<>();

        for (Question question : sessionQuestions) {
            List<Answer> answers = filterVisibleAnswers(
                    answersByQuestion.getOrDefault(question.getId(), List.of()));
            List<Long> selectedAnswerIds =
                    selectedByQuestion.getOrDefault(question.getId(), List.of());
            boolean questionCorrect = isQuestionAnswerCorrect(question, answers, selectedAnswerIds);
            if (questionCorrect) {
                correct++;
            }
            accumulateDifficultyStats(difficultyStats, question, questionCorrect);
            accumulateChapterStats(chapterStats, question, questionCorrect);
        }

        int total = sessionQuestions.size();
        int accuracyPercent = total == 0 ? 0 : Math.round(((float) correct / total) * 100f);
        return new AttemptGrade(correct, total, accuracyPercent, difficultyStats, chapterStats);
    }

    private void persistAttemptQuestionsBatch(Long attemptId, List<Question> sessionQuestions) {
        String sql = "INSERT INTO quiz_attempt_question (attempt_id, question_id, sort_order) VALUES (?, ?, ?)";
        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setLong(1, attemptId);
                ps.setLong(2, sessionQuestions.get(i).getId());
                ps.setInt(3, i);
            }

            @Override
            public int getBatchSize() {
                return sessionQuestions.size();
            }
        });
    }

    private void persistAttemptDetailsBatch(Long attemptId, Map<Long, List<Long>> selectedByQuestion) {
        String sql = "INSERT INTO quiz_attempt_detail (attempt_id, question_id, selected_answer_id) VALUES (?, ?, ?)";
        List<long[]> rows = new ArrayList<>();
        for (Map.Entry<Long, List<Long>> entry : selectedByQuestion.entrySet()) {
            for (Long answerId : entry.getValue()) {
                rows.add(new long[] {entry.getKey(), answerId});
            }
        }

        if (rows.isEmpty()) {
            return;
        }

        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                long[] row = rows.get(i);
                ps.setLong(1, attemptId);
                ps.setLong(2, row[0]);
                ps.setLong(3, row[1]);
            }

            @Override
            public int getBatchSize() {
                return rows.size();
            }
        });
    }

    private List<Question> resolveSessionQuestions(Quiz quiz, List<String> questionIds) {
        List<QuizQuestion> links =
                quizQuestionRepository.findByQuizIdWithQuestionDetails(quiz.getId());
        Map<Long, Question> questionById = links.stream()
                .map(QuizQuestion::getQuestion)
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(Question::getId, question -> question, (a, b) -> a));

        if (questionIds != null && !questionIds.isEmpty()) {
            List<Question> resolved = new ArrayList<>();
            for (String rawId : questionIds) {
                Question question = questionById.get(parseQuestionId(rawId));
                if (question != null) {
                    resolved.add(question);
                }
            }
            if (!resolved.isEmpty()) {
                return resolved;
            }
        }

        if (Boolean.TRUE.equals(quiz.getRandomQuestions()) && quiz.getRandomQuestionCount() != null) {
            List<QuizQuestion> shuffled = new ArrayList<>(links);
            int count = Math.min(quiz.getRandomQuestionCount(), shuffled.size());
            Collections.shuffle(shuffled);
            return shuffled.subList(0, count).stream()
                    .map(QuizQuestion::getQuestion)
                    .filter(Objects::nonNull)
                    .toList();
        }

        return links.stream().map(QuizQuestion::getQuestion).filter(Objects::nonNull).toList();
    }

    private List<Question> loadAttemptQuestions(QuizAttempt attempt, Quiz quiz) {
        List<QuizAttemptQuestion> snapshot =
                quizAttemptQuestionRepository.findByAttempt_IdOrderBySortOrderAsc(attempt.getId());
        if (!snapshot.isEmpty()) {
            return snapshot.stream()
                    .map(QuizAttemptQuestion::getQuestion)
                    .filter(Objects::nonNull)
                    .toList();
        }

        List<QuizAttemptDetail> details =
                quizAttemptDetailRepository.findByAttempt_IdOrderByIdAsc(attempt.getId());
        if (!details.isEmpty()) {
            return details.stream()
                    .map(QuizAttemptDetail::getQuestion)
                    .filter(Objects::nonNull)
                    .toList();
        }

        return quizQuestionRepository.findByQuizIdWithQuestionDetails(quiz.getId()).stream()
                .map(QuizQuestion::getQuestion)
                .filter(Objects::nonNull)
                .toList();
    }

    private int resolveElapsedSeconds(QuizAttempt attempt, Quiz quiz) {
        if (attempt.getElapsedSeconds() != null) {
            return Math.max(0, attempt.getElapsedSeconds());
        }
        return 0;
    }

    private int resolvePassingScore(Quiz quiz) {
        return quiz.getPassingScore() != null ? quiz.getPassingScore() : 70;
    }

    private boolean isQuestionAnswerCorrect(
            Question question, List<Answer> visibleAnswers, List<Long> selectedAnswerIds) {
        List<Long> correctIds = visibleAnswers.stream()
                .filter(answer -> Boolean.TRUE.equals(answer.getIsCorrect()))
                .map(Answer::getId)
                .sorted()
                .toList();
        List<Long> selectedIds = selectedAnswerIds == null
                ? List.of()
                : selectedAnswerIds.stream().filter(Objects::nonNull).sorted().toList();

        if (correctIds.isEmpty()) {
            return false;
        }

        if (isMultipleChoiceQuestion(question, visibleAnswers)) {
            return correctIds.equals(selectedIds);
        }

        return selectedIds.size() == 1 && correctIds.contains(selectedIds.get(0));
    }

    private boolean isMultipleChoiceQuestion(Question question, List<Answer> visibleAnswers) {
        if (question.getType() != null) {
            String type = question.getType().trim().toLowerCase();
            if (type.contains("nhiều") || type.contains("multiple")) {
                return true;
            }
        }
        return visibleAnswers.stream().filter(answer -> Boolean.TRUE.equals(answer.getIsCorrect())).count() > 1;
    }

    private List<Answer> filterVisibleAnswers(List<Answer> answers) {
        return answers.stream()
                .filter(answer -> answer.getSortOrder() < QuestionConstant.HIDDEN_ANSWER_SORT_ORDER_BASE)
                .sorted(Comparator.comparing(Answer::getSortOrder))
                .toList();
    }

    private String resolveReviewOptionState(Answer answer, List<Long> selectedAnswerIds) {
        boolean isCorrect = Boolean.TRUE.equals(answer.getIsCorrect());
        boolean isSelected = selectedAnswerIds != null && selectedAnswerIds.contains(answer.getId());

        if (isCorrect) {
            return "correct";
        }
        if (isSelected) {
            return "selected_wrong";
        }
        return "default";
    }

    private String formatScoreLabel(float score, int passingScore) {
        if (score <= 10f) {
            return String.format("%.1f/10", score);
        }
        return String.format("%.0f%% (đạt %d%%)", score, passingScore);
    }

    private String formatSubmittedAt(LocalDateTime attemptedAt) {
        return attemptedAt != null ? attemptedAt.format(SUBMITTED_AT) : "";
    }

    private List<StudentExamQuestionResponse> buildExamQuestions(Quiz quiz) {
        List<QuizQuestion> links = new ArrayList<>(
                quizQuestionRepository.findByQuizIdWithQuestionDetails(quiz.getId()));

        if (Boolean.TRUE.equals(quiz.getRandomQuestions()) && quiz.getRandomQuestionCount() != null) {
            int count = Math.min(quiz.getRandomQuestionCount(), links.size());
            Collections.shuffle(links);
            links = links.subList(0, count);
        }

        if (links.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> questionIds = links.stream()
                .map(link -> link.getQuestion().getId())
                .filter(Objects::nonNull)
                .toList();

        // Batch load all answers
        List<Answer> allAnswers = answerRepository.findByQuestion_IdInOrderByQuestion_IdAscSortOrderAsc(questionIds);
        Map<Long, List<Answer>> answersByQuestionId = allAnswers.stream()
                .collect(Collectors.groupingBy(answer -> answer.getQuestion().getId()));

        List<StudentExamQuestionResponse> result = new ArrayList<>();
        for (QuizQuestion link : links) {
            Question question = link.getQuestion();
            List<Answer> answers = new ArrayList<>(filterVisibleAnswers(
                    answersByQuestionId.getOrDefault(question.getId(), Collections.emptyList())));
            if (Boolean.TRUE.equals(quiz.getShuffleAnswers())) {
                Collections.shuffle(answers);
            }

            List<StudentExamOptionResponse> options = new ArrayList<>();
            for (int i = 0; i < answers.size(); i++) {
                Answer answer = answers.get(i);
                options.add(StudentExamOptionResponse.builder()
                        .answerId(answer.getId())
                        .label(i < OPTION_LABELS.length ? OPTION_LABELS[i] : String.valueOf(i + 1))
                        .content(answer.getContent())
                        .build());
            }

            boolean multipleChoice = isMultipleChoiceQuestion(question, answers);

            result.add(StudentExamQuestionResponse.builder()
                    .id("Q-" + question.getId())
                    .question(question.getContent())
                    .type(question.getType())
                    .multipleChoice(multipleChoice)
                    .options(options)
                    .build());
        }
        return result;
    }

    private Quiz getPublishedQuizForSubject(Long subjectId, Long quizId) {
        Quiz quiz = quizRepository
                .findById(quizId)
                .orElseThrow(() -> new AppException(ErrorCode.QUIZ_NOT_FOUND));
        if (!QuizConstant.PUBLISHED.equals(quiz.getStatus())) {
            throw new AppException(ErrorCode.QUIZ_PUBLISH_INVALID);
        }
        if (quiz.getSubject() == null || !quiz.getSubject().getId().equals(subjectId)) {
            throw new AppException(ErrorCode.QUIZ_SCOPE_INVALID);
        }
        LocalDateTime now = LocalDateTime.now();
        if (quiz.getAvailableFrom() != null && now.isBefore(quiz.getAvailableFrom())) {
            throw new AppException(ErrorCode.QUIZ_NOT_AVAILABLE);
        }
        if (quiz.getAvailableUntil() != null && now.isAfter(quiz.getAvailableUntil())) {
            throw new AppException(ErrorCode.QUIZ_NOT_AVAILABLE);
        }
        return quiz;
    }

    private User resolveStudent(Long studentId) {
        if (studentId == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        return userRepository
                .findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Long parseQuestionId(String rawId) {
        String normalized = rawId.trim();
        if (normalized.startsWith("Q-")) {
            normalized = normalized.substring(2);
        }
        return Long.valueOf(normalized);
    }

    private void accumulateDifficultyStats(
            Map<String, int[]> stats, Question question, boolean questionCorrect) {
        String label = normalizeDifficulty(question.getDifficulty());
        if (label == null) {
            return;
        }
        int[] bucket = stats.computeIfAbsent(label, key -> new int[] {0, 0});
        bucket[0]++;
        if (questionCorrect) {
            bucket[1]++;
        }
    }

    private void accumulateChapterStats(
            Map<String, int[]> stats, Question question, boolean questionCorrect) {
        String chapterTitle = resolveChapterTitle(question);
        int[] bucket = stats.computeIfAbsent(chapterTitle, key -> new int[] {0, 0});
        bucket[1]++;
        if (!questionCorrect) {
            bucket[0]++;
        }
    }

    private String normalizeDifficulty(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String trimmed = raw.trim();
        for (String known : DIFFICULTY_ORDER) {
            if (known.equalsIgnoreCase(trimmed)) {
                return known;
            }
        }
        return trimmed;
    }

    private String resolveChapterTitle(Question question) {
        Lesson lesson = question.getLesson();
        if (lesson != null && lesson.getChapter() != null && lesson.getChapter().getTitle() != null) {
            return lesson.getChapter().getTitle();
        }
        if (question.getTitle() != null && !question.getTitle().isBlank()) {
            return question.getTitle();
        }
        return "Nội dung chung";
    }

    private StudentExamSummaryResponse buildExamSummary(
            Quiz quiz,
            String attemptId,
            AttemptGrade grade,
            float scoreOnTen,
            int passingScore,
            boolean passed,
            int elapsedSeconds,
            LocalDateTime attemptedAt) {
        List<StudentExamDifficultySliceResponse> difficultyBreakdown =
                buildDifficultyBreakdown(grade.difficultyStats(), grade.total());
        boolean hasDifficultyChart = difficultyBreakdown.size() >= 2;
        List<StudentExamImproveTopicResponse> improveTopics = buildImproveTopics(grade.chapterStats());

        Subject subject = quiz.getSubject();
        return StudentExamSummaryResponse.builder()
                .attemptId(attemptId)
                .quizId(QuizConstant.publicId(quiz.getId()))
                .quizTitle(quiz.getTitle())
                .courseTitle(subject != null ? subject.getTitle() : "")
                .scoreLabel(String.format("%.1f/10", scoreOnTen))
                .passed(passed)
                .correctCount(grade.correct())
                .totalQuestions(grade.total())
                .accuracyPercent(grade.accuracyPercent())
                .passingScore(passingScore)
                .elapsedSeconds(elapsedSeconds)
                .durationMinutes(quiz.getTimeLimit() != null ? quiz.getTimeLimit() : 45)
                .submittedAt(formatSubmittedAt(attemptedAt))
                .hasDifficultyChart(hasDifficultyChart)
                .difficultySummaryLabel(resolveDifficultySummaryLabel(grade.accuracyPercent()))
                .difficultyBreakdown(difficultyBreakdown)
                .improveTopics(improveTopics)
                .build();
    }

    private List<StudentExamDifficultySliceResponse> buildDifficultyBreakdown(
            Map<String, int[]> difficultyStats, int totalQuestions) {
        if (difficultyStats.isEmpty() || totalQuestions == 0) {
            return List.of();
        }

        List<String> orderedLabels = new ArrayList<>();
        for (String label : DIFFICULTY_ORDER) {
            if (difficultyStats.containsKey(label)) {
                orderedLabels.add(label);
            }
        }
        difficultyStats.keySet().stream()
                .filter(label -> !orderedLabels.contains(label))
                .sorted()
                .forEach(orderedLabels::add);

        List<StudentExamDifficultySliceResponse> slices = new ArrayList<>();
        for (String label : orderedLabels) {
            int[] bucket = difficultyStats.get(label);
            int count = bucket[0];
            int correctCount = bucket[1];
            int accuracyPercent = count == 0 ? 0 : Math.round(((float) correctCount / count) * 100f);
            int sharePercent = Math.round(((float) count / totalQuestions) * 100f);
            slices.add(StudentExamDifficultySliceResponse.builder()
                    .key(label)
                    .label(label)
                    .count(count)
                    .correctCount(correctCount)
                    .percent(accuracyPercent)
                    .sharePercent(sharePercent)
                    .build());
        }
        return slices;
    }

    private List<StudentExamImproveTopicResponse> buildImproveTopics(Map<String, int[]> chapterStats) {
        return chapterStats.entrySet().stream()
                .filter(entry -> entry.getValue()[0] > 0)
                .sorted(Comparator.comparingInt((Map.Entry<String, int[]> entry) -> entry.getValue()[0])
                        .reversed())
                .limit(3)
                .map(entry -> {
                    int wrong = entry.getValue()[0];
                    int total = entry.getValue()[1];
                    String variant = resolveImproveVariant(wrong, total);
                    String description = String.format("Sai %d/%d câu hỏi liên quan.", wrong, total);
                    if ("ok".equals(variant)) {
                        description = String.format("Tiến triển tốt, sai %d/%d câu.", wrong, total);
                    }
                    return StudentExamImproveTopicResponse.builder()
                            .title(entry.getKey())
                            .description(description)
                            .wrongCount(wrong)
                            .totalCount(total)
                            .variant(variant)
                            .build();
                })
                .toList();
    }

    private String resolveImproveVariant(int wrong, int total) {
        if (total <= 0) {
            return "progress";
        }
        if (wrong >= total) {
            return "error";
        }
        if (wrong * 2 >= total) {
            return "error";
        }
        if (wrong == 1) {
            return "ok";
        }
        return "progress";
    }

    private String resolveDifficultySummaryLabel(int accuracyPercent) {
        if (accuracyPercent >= 85) {
            return "Tốt";
        }
        if (accuracyPercent >= 65) {
            return "Khá";
        }
        return "Cần cố gắng";
    }

    private record AttemptGrade(
            int correct,
            int total,
            int accuracyPercent,
            Map<String, int[]> difficultyStats,
            Map<String, int[]> chapterStats) {}
}
