package com.sed10.mln.study.service;

import com.sed10.mln.study.entity.*;
import com.sed10.mln.study.exception.AppException;
import com.sed10.mln.study.exception.ErrorCode;
import com.sed10.mln.study.dto.request.AnswerOptionRequest;
import com.sed10.mln.study.dto.request.BatchImportRequest;
import com.sed10.mln.study.dto.request.BatchImportRowRequest;
import com.sed10.mln.study.dto.request.BulkApproveQuestionsRequest;
import com.sed10.mln.study.dto.request.CheckDuplicateRequest;
import com.sed10.mln.study.dto.request.CreateQuestionRequest;
import com.sed10.mln.study.dto.response.BatchImportReportResponse;
import com.sed10.mln.study.dto.response.BatchImportRowResult;
import com.sed10.mln.study.dto.response.BulkApproveQuestionsResponse;
import com.sed10.mln.study.dto.response.DuplicateCheckResult;
import com.sed10.mln.study.dto.response.DuplicateCheckResponse;
import com.sed10.mln.study.dto.response.LessonOptionResponse;
import com.sed10.mln.study.dto.response.QuestionListResponse;
import com.sed10.mln.study.dto.response.QuestionMetadataResponse;
import com.sed10.mln.study.dto.response.QuestionResponse;
import com.sed10.mln.study.dto.response.QuestionStatsResponse;
import com.sed10.mln.study.constant.QuestionConstant;
import com.sed10.mln.study.mapper.QuestionMapper;
import com.sed10.mln.study.repository.*;
import com.sed10.mln.study.repository.specification.QuestionSpecification;
import com.sed10.mln.study.utils.ImportTitleNormalizer;
import com.sed10.mln.study.utils.QuestionContentHasher;
import com.sed10.mln.study.utils.QuestionContentNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QuestionLibraryService {
    private static final int MAX_PAGE_SIZE = 100;

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final LessonRepository lessonRepository;
    private final TagRepository tagRepository;
    private final QuestionTagRepository questionTagRepository;
    private final UserRepository userRepository;
    private final QuestionDuplicateService duplicateService;
    private final QuestionMapper mapper;

    @Transactional(readOnly = true)
    public QuestionMetadataResponse getMetadata() {
        List<Lesson> lessons = lessonRepository.findAllWithChapterAndSubject();
        List<LessonOptionResponse> lessonOptions = lessons.stream()
                .map(lesson -> {
                    Chapter chapter = lesson.getChapter();
                    Subject subject = chapter != null ? chapter.getSubject() : null;
                    return LessonOptionResponse.builder()
                            .id(lesson.getId())
                            .title(lesson.getTitle())
                            .chapterId(chapter != null ? chapter.getId() : null)
                            .chapterTitle(chapter != null ? chapter.getTitle() : "")
                            .subjectId(subject != null ? subject.getId() : null)
                            .subjectTitle(subject != null ? subject.getTitle() : "")
                            .build();
                })
                .toList();

        return QuestionMetadataResponse.builder()
                .courses(lessonOptions.stream()
                        .map(LessonOptionResponse::getSubjectTitle)
                        .filter(title -> title != null && !title.isBlank())
                        .distinct()
                        .toList())
                .chapters(lessonOptions.stream()
                        .map(LessonOptionResponse::getChapterTitle)
                        .filter(title -> title != null && !title.isBlank())
                        .distinct()
                        .toList())
                .lessons(lessonOptions.stream().map(LessonOptionResponse::getTitle).toList())
                .lessonOptions(lessonOptions)
                .build();
    }

    @Transactional(readOnly = true)
    public QuestionListResponse listQuestions(
            String search,
            String course,
            String chapter,
            String lesson,
            String difficulty,
            String type,
            String status,
            int page,
            int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), MAX_PAGE_SIZE);
        Specification<Question> specification = QuestionSpecification.withFilters(
                search, course, chapter, lesson, difficulty, type, status);
        Page<Question> result = questionRepository.findAll(
                specification,
                PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "updatedAt")));

        return QuestionListResponse.builder()
                .items(result.getContent().stream().map(mapper::toListItemResponse).toList())
                .total(result.getTotalElements())
                .page(safePage)
                .size(safeSize)
                .build();
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestion(Long id) {
        return questionRepository
                .findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));
    }

    @Transactional
    public QuestionResponse approveQuestion(Long id) {
        Question question = questionRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));
        if (!QuestionConstant.PENDING.equals(question.getStatus())) {
            throw new AppException(ErrorCode.QUESTION_NOT_PENDING);
        }

        LocalDateTime now = LocalDateTime.now();
        question.setStatus(QuestionConstant.PUBLISHED);
        question.setPublishedAt(now);
        question.setUpdatedAt(now);
        return mapper.toResponse(questionRepository.save(question));
    }

    @Transactional
    public BulkApproveQuestionsResponse bulkApproveQuestions(BulkApproveQuestionsRequest request) {
        List<Long> requestedIds = request.getIds() == null
                ? List.of()
                : request.getIds().stream().filter(Objects::nonNull).distinct().toList();
        List<Question> questions = questionRepository.findAllById(requestedIds);
        List<Question> approvedQuestions = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        int skippedNotPending = 0;
        int skippedWarning = 0;

        for (Question question : questions) {
            if (!QuestionConstant.PENDING.equals(question.getStatus())) {
                skippedNotPending++;
                continue;
            }
            if (question.getDuplicateWarning() != null && !question.getDuplicateWarning().isBlank()) {
                skippedWarning++;
                continue;
            }
            question.setStatus(QuestionConstant.PUBLISHED);
            question.setPublishedAt(now);
            question.setUpdatedAt(now);
            approvedQuestions.add(question);
        }

        questionRepository.saveAll(approvedQuestions);
        return BulkApproveQuestionsResponse.builder()
                .requestedCount(requestedIds.size())
                .approvedCount(approvedQuestions.size())
                .skippedNotPending(skippedNotPending)
                .skippedWarning(skippedWarning)
                .notFound(requestedIds.size() - questions.size())
                .build();
    }

    @Transactional(readOnly = true)
    public QuestionStatsResponse getStats() {
        Map<String, Long> byDifficulty = new LinkedHashMap<>();
        byDifficulty.put("Cơ bản", 0L);
        byDifficulty.put("Vận dụng", 0L);
        byDifficulty.put("Nâng cao", 0L);

        Map<String, Long> byStatus = new LinkedHashMap<>();
        byStatus.put("Bản nháp", 0L);
        byStatus.put("Cần duyệt", 0L);
        byStatus.put("Đã xuất bản", 0L);

        for (QuestionRepository.QuestionCountProjection count : questionRepository.countGroupedByDifficulty()) {
            byDifficulty.put(count.getValue(), count.getTotal());
        }
        for (QuestionRepository.QuestionCountProjection count : questionRepository.countGroupedByStatus()) {
            byStatus.put(QuestionConstant.toLabel(count.getValue()), count.getTotal());
        }

        return QuestionStatsResponse.builder()
                .totalQuestions(questionRepository.count())
                .totalCourses(questionRepository.countDistinctCourses())
                .byDifficulty(byDifficulty)
                .byStatus(byStatus)
                .build();
    }

    @Transactional(readOnly = true)
    public DuplicateCheckResponse checkDuplicate(CheckDuplicateRequest request) {
        if (request.getLessonId() == null) {
            throw new AppException(ErrorCode.LESSON_NOT_FOUND);
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new AppException(ErrorCode.QUESTION_CONTENT_REQUIRED);
        }

        DuplicateCheckResult duplicate = duplicateService.check(
                request.getLessonId(),
                request.getType(),
                request.getContent(),
                request.getExcludeQuestionId());

        QuestionResponse matchedQuestion = null;
        if (duplicate.getMatchedQuestionId() != null) {
            matchedQuestion = questionRepository
                    .findById(duplicate.getMatchedQuestionId())
                    .map(mapper::toResponse)
                    .orElse(null);
        }

        return DuplicateCheckResponse.builder()
                .exactDuplicate(duplicate.isExactDuplicate())
                .similarDuplicate(duplicate.isSimilarDuplicate())
                .warningMessage(duplicate.getWarningMessage())
                .matchedQuestion(matchedQuestion)
                .build();
    }

    @Transactional
    public QuestionResponse createQuestion(CreateQuestionRequest request) {
        validateCreateRequest(request);
        Lesson lesson = lessonRepository
                .findById(request.getLessonId())
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        String content = resolveContent(request);
        DuplicateCheckResult duplicate = duplicateService.check(
                lesson.getId(), request.getType(), content, null);

        if (duplicate.isExactDuplicate()) {
            throw new AppException(ErrorCode.QUESTION_DUPLICATE_EXACT);
        }
        if (duplicate.isSimilarDuplicate() && !Boolean.TRUE.equals(request.getAllowSimilarSave())) {
            throw new AppException(ErrorCode.QUESTION_DUPLICATE_EXACT);
        }

        User teacher = com.sed10.mln.study.security.SecurityUtils.getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        String statusCode = resolveNewQuestionStatus(request.getStatus());

        Question question = Question.builder()
                .lesson(lesson)
                .title(resolveTitle(request, content))
                .content(content)
                .contentHash(duplicate.getContentHash())
                .duplicateWarning(duplicate.getWarningMessage())
                .type(request.getType())
                .difficulty(request.getDifficulty())
                .status(statusCode)
                .bloomLevel(request.getBloomLevel())
                .explanation(request.getExplanation())
                .score(request.getScore() != null ? request.getScore() : BigDecimal.ONE)
                .estimatedTimeSeconds(request.getEstimatedTime() != null ? request.getEstimatedTime() : 60)
                .createdBy(teacher)
                .updatedBy(teacher)
                .createdAt(now)
                .updatedAt(now)
                .publishedAt(QuestionConstant.PUBLISHED.equals(statusCode) ? now : null)
                .build();

        question = questionRepository.save(question);
        saveAnswers(question, request);
        saveTags(question, request.getTags());
        return mapper.toResponse(question);
    }

    @Transactional
    public BatchImportReportResponse batchImport(BatchImportRequest request) {
        if (request.getLessonId() == null) {
            throw new AppException(ErrorCode.LESSON_NOT_FOUND);
        }
        Lesson lesson = lessonRepository
                .findById(request.getLessonId())
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        String statusCode = resolveImportStatus(request.getTargetStatus());
        List<BatchImportRowRequest> rows = request.getRows() == null ? List.of() : request.getRows();

        Map<String, String> internalHashes = new HashMap<>();
        Map<Long, Lesson> lessonCache = new HashMap<>();
        Map<Long, List<Question>> duplicateCandidatesByLesson = new HashMap<>();
        List<BatchImportRowResult> rowResults = new ArrayList<>();
        int saved = 0;
        int skippedExact = 0;
        int markedSimilar = 0;
        int failedValidation = 0;

        lessonCache.put(lesson.getId(), lesson);

        for (BatchImportRowRequest row : rows) {
            if (row == null) {
                failedValidation++;
                rowResults.add(rowResult(null, "FAILED", "Dòng dữ liệu không hợp lệ", null));
                continue;
            }
            if (row.getContent() == null || row.getContent().isBlank()) {
                failedValidation++;
                rowResults.add(rowResult(row.getRowId(), "FAILED", "Nội dung trống", null));
                continue;
            }

            Lesson rowLesson = resolveImportLesson(lesson, row, lessonCache);
            if (rowLesson == null) {
                failedValidation++;
                rowResults.add(rowResult(
                        row.getRowId(),
                        "FAILED",
                        "Không tìm thấy bài học phù hợp (môn/chương/bài)",
                        null));
                continue;
            }

            String type = row.getType() != null && !row.getType().isBlank() ? row.getType() : "Trắc nghiệm";
            String normalized = QuestionContentNormalizer.normalize(row.getContent());
            String hash = QuestionContentHasher.hash(rowLesson.getId(), type, normalized);
            String hashKey = rowLesson.getId() + "|" + hash;

            if (internalHashes.containsKey(hashKey)) {
                skippedExact++;
                rowResults.add(rowResult(row.getRowId(), "SKIPPED_INTERNAL", "Trùng trong file import", null));
                continue;
            }
            internalHashes.put(hashKey, row.getRowId());

            List<Question> duplicateCandidates = duplicateCandidatesByLesson.computeIfAbsent(
                    rowLesson.getId(),
                    questionRepository::findByLesson_Id);
            DuplicateCheckResult duplicate = duplicateService.checkAgainstCandidates(
                    rowLesson.getId(),
                    type,
                    row.getContent(),
                    null,
                    duplicateCandidates);
            if (duplicate.isExactDuplicate()) {
                skippedExact++;
                rowResults.add(rowResult(
                        row.getRowId(),
                        "SKIPPED_DB",
                        "Trùng câu hỏi ID " + duplicate.getMatchedQuestionId(),
                        null));
                continue;
            }

            CreateQuestionRequest createRequest = new CreateQuestionRequest();
            createRequest.setLessonId(rowLesson.getId());
            createRequest.setQuestion(row.getContent());
            createRequest.setTitle(row.getContent());
            createRequest.setType(type);
            createRequest.setDifficulty(
                    row.getDifficulty() != null && !row.getDifficulty().isBlank()
                            ? row.getDifficulty()
                            : "Cơ bản");
            createRequest.setStatus(QuestionConstant.toLabel(statusCode));
            createRequest.setTags(parseTags(row.getTags()));
            createRequest.setOptions(row.getOptions());
            createRequest.setAnswer(row.getAnswer());
            createRequest.setExplanation(row.getExplanation());
            createRequest.setAllowSimilarSave(true);

            Question savedQuestion = persistImportedQuestion(createRequest, duplicate, rowLesson);
            duplicateCandidates.add(savedQuestion);
            if (duplicate.isSimilarDuplicate()) {
                markedSimilar++;
            }
            saved++;
            rowResults.add(rowResult(
                    row.getRowId(),
                    duplicate.isSimilarDuplicate() ? "SAVED_SIMILAR" : "SAVED",
                    duplicate.getWarningMessage(),
                    "Q-" + savedQuestion.getId()));
        }

        return BatchImportReportResponse.builder()
                .totalRows(rows.size())
                .savedCount(saved)
                .skippedExactDuplicate(skippedExact)
                .markedSimilar(markedSimilar)
                .failedValidation(failedValidation)
                .rows(rowResults)
                .build();
    }

    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new AppException(ErrorCode.QUESTION_NOT_FOUND);
        }
        answerRepository.deleteByQuestion_Id(id);
        questionTagRepository.deleteByQuestion_Id(id);
        questionRepository.deleteById(id);
    }

    @Transactional
    public void deleteQuestions(List<Long> ids) {
        for (Long id : ids) {
            deleteQuestion(id);
        }
    }

    private Question persistImportedQuestion(
            CreateQuestionRequest request,
            DuplicateCheckResult duplicate,
            Lesson lesson) {
        User teacher = com.sed10.mln.study.security.SecurityUtils.getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        String statusCode = QuestionConstant.fromLabel(request.getStatus());
        String content = request.getQuestion().trim();

        Question question = Question.builder()
                .lesson(lesson)
                .title(resolveTitle(request, content))
                .content(content)
                .contentHash(duplicate.getContentHash())
                .duplicateWarning(duplicate.getWarningMessage())
                .type(request.getType())
                .difficulty(request.getDifficulty())
                .status(statusCode)
                .explanation(request.getExplanation())
                .score(BigDecimal.ONE)
                .estimatedTimeSeconds(60)
                .createdBy(teacher)
                .updatedBy(teacher)
                .createdAt(now)
                .updatedAt(now)
                .publishedAt(QuestionConstant.PUBLISHED.equals(statusCode) ? now : null)
                .build();
        question = questionRepository.save(question);
        saveAnswers(question, request);
        saveTags(question, request.getTags());
        return question;
    }

    private String resolveImportStatus(String targetStatus) {
        if (targetStatus == null || targetStatus.isBlank()) {
            return QuestionConstant.PENDING;
        }

        String trimmed = targetStatus.trim();
        if ("APPROVED".equalsIgnoreCase(trimmed) || "Đã duyệt".equalsIgnoreCase(trimmed)) {
            return QuestionConstant.PUBLISHED;
        }

        String normalized = QuestionConstant.fromLabel(trimmed);
        if (QuestionConstant.PUBLISHED.equals(normalized) || QuestionConstant.PENDING.equals(normalized)) {
            return normalized;
        }

        return QuestionConstant.PENDING;
    }

    private void validateCreateRequest(CreateQuestionRequest request) {
        if (request.getLessonId() == null) {
            throw new AppException(ErrorCode.LESSON_NOT_FOUND);
        }
        String content = resolveContent(request);
        if (content.isBlank()) {
            throw new AppException(ErrorCode.QUESTION_CONTENT_REQUIRED);
        }
    }

    private String resolveNewQuestionStatus(String requestedStatus) {
        return QuestionConstant.fromLabel(requestedStatus);
    }

    @Transactional
    public QuestionResponse updateQuestion(Long id, CreateQuestionRequest request) {
        Question question = questionRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));
        if (QuestionConstant.PUBLISHED.equals(question.getStatus())) {
            throw new AppException(ErrorCode.QUESTION_PUBLISHED_NOT_EDITABLE);
        }

        validateCreateRequest(request);
        Lesson lesson = lessonRepository
                .findById(request.getLessonId())
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        String content = resolveContent(request);
        DuplicateCheckResult duplicate = duplicateService.check(
                lesson.getId(), request.getType(), content, id);

        if (duplicate.isExactDuplicate()) {
            throw new AppException(ErrorCode.QUESTION_DUPLICATE_EXACT);
        }
        if (duplicate.isSimilarDuplicate() && !Boolean.TRUE.equals(request.getAllowSimilarSave())) {
            throw new AppException(ErrorCode.QUESTION_DUPLICATE_EXACT);
        }

        User teacher = com.sed10.mln.study.security.SecurityUtils.getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        String statusCode = QuestionConstant.fromLabel(request.getStatus());
        if (QuestionConstant.PUBLISHED.equals(statusCode) && question.getPublishedAt() == null) {
            question.setPublishedAt(now);
        }

        question.setLesson(lesson);
        question.setTitle(resolveTitle(request, content));
        question.setContent(content);
        question.setContentHash(duplicate.getContentHash());
        question.setDuplicateWarning(duplicate.getWarningMessage());
        question.setType(request.getType());
        question.setDifficulty(request.getDifficulty());
        question.setStatus(statusCode);
        question.setBloomLevel(request.getBloomLevel());
        question.setExplanation(request.getExplanation());
        question.setScore(request.getScore() != null ? request.getScore() : BigDecimal.ONE);
        question.setEstimatedTimeSeconds(
                request.getEstimatedTime() != null ? request.getEstimatedTime() : 60);
        question.setUpdatedBy(teacher);
        question.setUpdatedAt(now);

        question = questionRepository.save(question);
        saveAnswers(question, request);
        saveTags(question, request.getTags());
        return mapper.toResponse(question);
    }

    private String resolveContent(CreateQuestionRequest request) {
        if (request.getQuestion() != null && !request.getQuestion().isBlank()) {
            return request.getQuestion().trim();
        }
        return request.getTitle() != null ? request.getTitle().trim() : "";
    }

    private String resolveTitle(CreateQuestionRequest request, String content) {
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            return request.getTitle().trim();
        }
        return content.length() > 500 ? content.substring(0, 500) : content;
    }

    private void saveAnswers(Question question, CreateQuestionRequest request) {
        answerRepository.deleteByQuestion_Id(question.getId());
        List<AnswerOptionRequest> options = request.getOptions();
        if (options == null || options.isEmpty()) {
            if (request.getAnswer() != null && !request.getAnswer().isBlank()) {
                answerRepository.save(Answer.builder()
                        .question(question)
                        .content(request.getAnswer().trim())
                        .isCorrect(true)
                        .sortOrder(0)
                        .build());
            }
            return;
        }

        int order = 0;
        String normalizedAnswer = request.getAnswer() != null ? request.getAnswer().trim() : "";
        for (AnswerOptionRequest option : options) {
            if (option.getContent() == null || option.getContent().isBlank()) {
                continue;
            }
            boolean isCorrect = Boolean.TRUE.equals(option.getIsCorrect());
            if (!isCorrect && request.getCorrectOptionIndex() != null) {
                isCorrect = order == request.getCorrectOptionIndex();
            }
            if (!isCorrect && !normalizedAnswer.isBlank()) {
                isCorrect = option.getContent().trim().equalsIgnoreCase(normalizedAnswer);
            }
            answerRepository.save(Answer.builder()
                    .question(question)
                    .content(option.getContent().trim())
                    .isCorrect(isCorrect)
                    .sortOrder(order++)
                    .build());
        }
    }

    private void saveTags(Question question, List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return;
        }
        List<String> normalizedTags =
                tags.stream().filter(tag -> tag != null && !tag.isBlank()).map(String::trim).distinct().toList();
        if (normalizedTags.isEmpty()) {
            return;
        }
        questionTagRepository.deleteByQuestion_Id(question.getId());
        for (String tagName : normalizedTags) {
            Tag tag = tagRepository
                    .findByNameIgnoreCase(tagName)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
            QuestionTagId id = new QuestionTagId(question.getId(), tag.getId());
            questionTagRepository.save(QuestionTag.builder()
                    .id(id)
                    .question(question)
                    .tag(tag)
                    .build());
        }
    }

    private List<String> parseTags(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return Arrays.stream(raw.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }

    private Lesson resolveImportLesson(
            Lesson defaultLesson,
            BatchImportRowRequest row,
            Map<Long, Lesson> lessonCache) {
        if (row.getLessonId() != null) {
            return lessonCache.computeIfAbsent(
                    row.getLessonId(),
                    lessonId -> lessonRepository.findById(lessonId).orElse(null));
        }
        if (hasImportText(row.getSubjectTitle())
                && hasImportText(row.getChapterTitle())
                && hasImportText(row.getLessonTitle())) {
            return findLessonByTitles(row.getSubjectTitle(), row.getChapterTitle(), row.getLessonTitle());
        }
        return defaultLesson;
    }

    private Lesson findLessonByTitles(String subjectTitle, String chapterTitle, String lessonTitle) {
        List<Lesson> lessons = lessonRepository.findAllWithChapterAndSubject();

        Lesson exact = lessons.stream()
                .filter(lesson -> matchesLessonTriple(lesson, subjectTitle, chapterTitle, lessonTitle, true))
                .findFirst()
                .orElse(null);
        if (exact != null) {
            return exact;
        }

        if (hasImportText(subjectTitle) && hasImportText(lessonTitle)) {
            List<Lesson> bySubjectLesson = lessons.stream()
                    .filter(lesson -> ImportTitleNormalizer.equals(
                                    lesson.getChapter() != null
                                            && lesson.getChapter().getSubject() != null
                                            ? lesson.getChapter().getSubject().getTitle()
                                            : "",
                                    subjectTitle)
                            && ImportTitleNormalizer.equals(lesson.getTitle(), lessonTitle))
                    .toList();
            if (bySubjectLesson.size() == 1) {
                return bySubjectLesson.get(0);
            }
        }

        List<Lesson> fuzzy = lessons.stream()
                .filter(lesson -> matchesLessonTriple(lesson, subjectTitle, chapterTitle, lessonTitle, false))
                .toList();
        if (fuzzy.size() == 1) {
            return fuzzy.get(0);
        }

        if (hasImportText(lessonTitle)) {
            List<Lesson> byLessonOnly = lessons.stream()
                    .filter(lesson -> ImportTitleNormalizer.equals(lesson.getTitle(), lessonTitle))
                    .toList();
            if (byLessonOnly.size() == 1) {
                return byLessonOnly.get(0);
            }
        }

        return null;
    }

    private boolean matchesLessonTriple(
            Lesson lesson,
            String subjectTitle,
            String chapterTitle,
            String lessonTitle,
            boolean strictChapter) {
        Chapter chapter = lesson.getChapter();
        Subject subject = chapter != null ? chapter.getSubject() : null;
        if (subject == null || chapter == null) {
            return false;
        }

        if (hasImportText(subjectTitle)
                && !ImportTitleNormalizer.equals(subject.getTitle(), subjectTitle)) {
            return false;
        }
        if (hasImportText(chapterTitle)) {
            boolean chapterMatch = strictChapter
                    ? ImportTitleNormalizer.equals(chapter.getTitle(), chapterTitle)
                    : ImportTitleNormalizer.compatible(chapter.getTitle(), chapterTitle);
            if (!chapterMatch) {
                return false;
            }
        }
        if (hasImportText(lessonTitle)) {
            boolean lessonMatch = strictChapter
                    ? ImportTitleNormalizer.equals(lesson.getTitle(), lessonTitle)
                    : ImportTitleNormalizer.compatible(lesson.getTitle(), lessonTitle);
            if (!lessonMatch) {
                return false;
            }
        }

        return hasImportText(lessonTitle) || hasImportText(chapterTitle) || hasImportText(subjectTitle);
    }

    private String normalizeImportTitle(String value) {
        return ImportTitleNormalizer.normalize(value);
    }

    private boolean hasImportText(String value) {
        return value != null && !value.isBlank();
    }

    private BatchImportRowResult rowResult(String rowId, String status, String message, String questionId) {
        return BatchImportRowResult.builder()
                .rowId(rowId)
                .status(status)
                .message(message)
                .questionId(questionId)
                .build();
    }
}
