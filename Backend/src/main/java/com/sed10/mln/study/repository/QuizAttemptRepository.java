package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    long countByQuiz_Id(Long quizId);

    @Query("SELECT qa.quiz.id, COUNT(qa) FROM QuizAttempt qa WHERE qa.quiz.id IN :quizIds GROUP BY qa.quiz.id")
    List<Object[]> countGroupedByQuizIds(@Param("quizIds") List<Long> quizIds);
}
