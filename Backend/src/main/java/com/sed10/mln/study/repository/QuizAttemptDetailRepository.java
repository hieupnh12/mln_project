package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.QuizAttemptDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptDetailRepository extends JpaRepository<QuizAttemptDetail, Long> {
    List<QuizAttemptDetail> findByAttempt_IdOrderByIdAsc(Long attemptId);
}
