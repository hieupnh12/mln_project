package com.sed10.mln.study.service;

import com.sed10.mln.study.dto.response.DuplicateCheckResult;
import com.sed10.mln.study.entity.Question;
import com.sed10.mln.study.repository.QuestionRepository;
import com.sed10.mln.study.utils.QuestionContentHasher;
import com.sed10.mln.study.utils.QuestionContentNormalizer;
import com.sed10.mln.study.utils.QuestionSimilarityChecker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionDuplicateService {
    private final QuestionRepository questionRepository;

    public DuplicateCheckResult check(Long lessonId, String type, String content, Long excludeQuestionId) {
        String normalized = QuestionContentNormalizer.normalize(content);
        String hash = QuestionContentHasher.hash(lessonId, type, normalized);

        Optional<Question> exact = questionRepository.findByContentHashAndLesson_Id(hash, lessonId)
                .filter(question -> excludeQuestionId == null || !question.getId().equals(excludeQuestionId));

        if (exact.isPresent()) {
            return DuplicateCheckResult.builder()
                    .contentHash(hash)
                    .normalizedContent(normalized)
                    .exactDuplicate(true)
                    .matchedQuestionId(exact.get().getId())
                    .warningMessage("Câu hỏi trùng hoàn toàn với ID " + exact.get().getId())
                    .build();
        }

        List<Question> candidates = questionRepository.findByLesson_Id(lessonId);
        for (Question candidate : candidates) {
            if (excludeQuestionId != null && candidate.getId().equals(excludeQuestionId)) {
                continue;
            }
            String candidateNormalized = QuestionContentNormalizer.normalize(candidate.getContent());
            if (QuestionSimilarityChecker.isSimilar(normalized, candidateNormalized)) {
                return DuplicateCheckResult.builder()
                        .contentHash(hash)
                        .normalizedContent(normalized)
                        .similarDuplicate(true)
                        .matchedQuestionId(candidate.getId())
                        .warningMessage(
                                "Câu hỏi tương tự với ID "
                                        + candidate.getId()
                                        + " (độ tương đồng >= "
                                        + (int) (QuestionSimilarityChecker.SIMILARITY_THRESHOLD * 100)
                                        + "%)")
                        .build();
            }
        }

        return DuplicateCheckResult.builder()
                .contentHash(hash)
                .normalizedContent(normalized)
                .build();
    }
}
