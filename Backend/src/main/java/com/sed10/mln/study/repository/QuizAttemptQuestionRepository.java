package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.QuizAttemptQuestion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptQuestionRepository extends JpaRepository<QuizAttemptQuestion, Long> {
    @EntityGraph(attributePaths = "question")
    List<QuizAttemptQuestion> findByAttempt_IdOrderBySortOrderAsc(Long attemptId);
}
