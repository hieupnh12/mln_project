package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.QuizAttemptDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptDetailRepository extends JpaRepository<QuizAttemptDetail, Long> {
    @EntityGraph(attributePaths = {"question", "selectedAnswer"})
    List<QuizAttemptDetail> findByAttempt_IdOrderByIdAsc(Long attemptId);
}
