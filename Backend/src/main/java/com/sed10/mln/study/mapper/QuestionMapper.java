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
import java.util.List;

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
        Lesson lesson = question.getLesson();
        Chapter chapter = lesson != null ? lesson.getChapter() : null;
        Subject subject = chapter != null ? chapter.getSubject() : null;

        List<Answer> answers = answerRepository.findByQuestion_IdOrderBySortOrderAsc(question.getId());
        List<String> options = answers.stream().map(Answer::getContent).toList();
        List<Integer> correctOptionIndices = new ArrayList<>();
        for (int index = 0; index < answers.size(); index++) {
            if (Boolean.TRUE.equals(answers.get(index).getIsCorrect())) {
                correctOptionIndices.add(index);
            }
        }
        String correctAnswer = answers.stream()
                .filter(answer -> Boolean.TRUE.equals(answer.getIsCorrect()))
                .map(Answer::getContent)
                .findFirst()
                .orElse("");

        List<String> tags = questionTagRepository.findByQuestion_Id(question.getId()).stream()
                .map(questionTag -> questionTag.getTag().getName())
                .toList();

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
