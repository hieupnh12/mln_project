package com.sed10.mln.study.service;

import com.sed10.mln.study.constant.QuestionConstant;
import com.sed10.mln.study.dto.response.QuestionResponse;
import com.sed10.mln.study.mapper.QuestionMapper;
import com.sed10.mln.study.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentPracticeService {
    private static final int MAX_QUESTION_SIZE = 200;

    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;

    @Transactional(readOnly = true)
    public List<QuestionResponse> listPracticeQuestions(
            Long subjectId,
            Long chapterId,
            Long lessonId,
            int size) {
        int safeSize = Math.min(Math.max(1, size), MAX_QUESTION_SIZE);

        return questionRepository
                .findPracticeQuestions(
                        subjectId,
                        chapterId,
                        lessonId,
                        QuestionConstant.PUBLISHED,
                        PageRequest.of(0, safeSize, Sort.by(Sort.Direction.DESC, "updatedAt", "id")))
                .getContent()
                .stream()
                .map(questionMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countPracticeQuestions(Long subjectId, Long chapterId, Long lessonId) {
        return questionRepository.countPracticeQuestions(
                subjectId,
                chapterId,
                lessonId,
                QuestionConstant.PUBLISHED);
    }
}
