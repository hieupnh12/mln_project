package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.QuizQuestion;
import com.sed10.mln.study.entity.QuizQuestionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, QuizQuestionId> {
    List<QuizQuestion> findByQuiz_IdOrderBySortOrderAsc(Long quizId);

    void deleteByQuiz_Id(Long quizId);

    long countByQuiz_Id(Long quizId);

    @Query("SELECT qq.quiz.id, COUNT(qq) FROM QuizQuestion qq WHERE qq.quiz.id IN :quizIds GROUP BY qq.quiz.id")
    List<Object[]> countGroupedByQuizIds(@Param("quizIds") List<Long> quizIds);
}
