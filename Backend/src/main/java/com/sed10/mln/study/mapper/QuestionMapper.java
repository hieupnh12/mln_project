package com.sed10.mln.study.mapper;

import com.sed10.mln.study.constant.QuestionConstant;
import com.sed10.mln.study.dto.response.QuestionListItemResponse;
import com.sed10.mln.study.dto.response.QuestionResponse;
import com.sed10.mln.study.entity.*;
import com.sed10.mln.study.repository.AnswerRepository;
import com.sed10.mln.study.repository.QuestionTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class QuestionMapper {
    private final AnswerRepository answerRepository;
    private final QuestionTagRepository questionTagRepository;

    public QuestionListItemResponse toListItemResponse(Question question) {
        Lesson lesson = question.getLesson();
        Chapter chapter = lesson != null ? lesson.getChapter() : null;
        Subject subject = chapter != null ? chapter.getSubject() : null;

        return QuestionListItemResponse.builder()
                .id("Q-" + question.getId())
                .title(question.getTitle())
                .question(question.getContent())
                .type(question.getType())
                .difficulty(question.getDifficulty())
                .status(QuestionConstant.toLabel(question.getStatus()))
                .course(subject != null ? subject.getTitle() : "")
                .chapter(chapter != null ? chapter.getTitle() : "")
                .lesson(lesson != null ? lesson.getTitle() : "")
                .build();
    }

    public QuestionResponse toResponse(Question question) {
        List<Answer> answers = answerRepository.findByQuestion_IdOrderBySortOrderAsc(question.getId());
        List<String> tags = questionTagRepository.findByQuestion_Id(question.getId()).stream()
                .map(questionTag -> questionTag.getTag() != null ? questionTag.getTag().getName() : null)
                .filter(Objects::nonNull)
                .toList();
        return toResponse(question, answers, tags);
    }

    public List<QuestionResponse> toResponses(List<Question> questions) {
        if (questions == null || questions.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> questionIds = questions.stream().map(Question::getId).toList();

        // Batch fetch answers
        List<Answer> allAnswers = answerRepository.findByQuestion_IdInOrderByQuestion_IdAscSortOrderAsc(questionIds);
        Map<Long, List<Answer>> answersByQuestionId = allAnswers.stream()
                .collect(Collectors.groupingBy(answer -> answer.getQuestion().getId()));

        // Batch fetch tags
        List<QuestionTag> allQuestionTags = questionTagRepository.findByQuestion_IdIn(questionIds);
        Map<Long, List<String>> tagsByQuestionId = allQuestionTags.stream()
                .collect(Collectors.groupingBy(
                        qt -> qt.getQuestion().getId(),
                        Collectors.mapping(
                                qt -> qt.getTag() != null ? qt.getTag().getName() : null,
                                Collectors.filtering(Objects::nonNull, Collectors.toList()))));

        return questions.stream()
                .map(q -> toResponse(
                        q,
                        answersByQuestionId.getOrDefault(q.getId(), Collections.emptyList()),
                        tagsByQuestionId.getOrDefault(q.getId(), Collections.emptyList())
                ))
                .toList();
    }

    public QuestionResponse toResponse(Question question, List<Answer> answers, List<String> tags) {
        Lesson lesson = question.getLesson();
        Chapter chapter = lesson != null ? lesson.getChapter() : null;
        Subject subject = chapter != null ? chapter.getSubject() : null;

        List<Answer> visibleAnswers = answers.stream()
                .filter(answer -> answer.getSortOrder() < QuestionConstant.HIDDEN_ANSWER_SORT_ORDER_BASE)
                .sorted(Comparator.comparing(Answer::getSortOrder))
                .toList();

        List<String> options = visibleAnswers.stream().map(Answer::getContent).toList();
        List<Integer> correctOptionIndices = new ArrayList<>();
        for (int index = 0; index < visibleAnswers.size(); index++) {
            if (Boolean.TRUE.equals(visibleAnswers.get(index).getIsCorrect())) {
                correctOptionIndices.add(index);
            }
        }
        String correctAnswer = visibleAnswers.stream()
                .filter(answer -> Boolean.TRUE.equals(answer.getIsCorrect()))
                .map(Answer::getContent)
                .collect(Collectors.joining(", "));

        User updatedBy = question.getUpdatedBy() != null ? question.getUpdatedBy() : question.getCreatedBy();
        String updatedByName = updatedBy != null && updatedBy.getFullName() != null
                ? updatedBy.getFullName()
                : "Giảng viên";

        return QuestionResponse.builder()
                .id("Q-" + question.getId())
                .subjectId(subject != null ? subject.getId() : null)
                .chapterId(chapter != null ? chapter.getId() : null)
                .lessonId(lesson != null ? lesson.getId() : null)
                .title(question.getTitle())
                .question(question.getContent())
                .type(question.getType())
                .difficulty(question.getDifficulty())
                .status(QuestionConstant.toLabel(question.getStatus()))
                .course(subject != null ? subject.getTitle() : "")
                .chapter(chapter != null ? chapter.getTitle() : "")
                .lesson(lesson != null ? lesson.getTitle() : "")
                .answer(correctAnswer)
                .explanation(question.getExplanation())
                .score(question.getScore())
                .estimatedTime(question.getEstimatedTimeSeconds())
                .tags(tags)
                .options(options)
                .correctOptionIndices(correctOptionIndices)
                .updatedBy(updatedByName)
                .duplicateWarning(question.getDuplicateWarning())
                .build();
    }
}
