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

    List<QuizAttempt> findByStudent_IdAndQuiz_Subject_IdOrderByAttemptedAtDesc(
            Long studentId, Long subjectId);

    @Query("""
            SELECT qa FROM QuizAttempt qa
            INNER JOIN FETCH qa.quiz q
            LEFT JOIN FETCH q.subject
            WHERE qa.student.id = :studentId
              AND q.subject.id = :subjectId
              AND NOT EXISTS (
                  SELECT 1 FROM QuizAttempt newer
                  WHERE newer.student.id = qa.student.id
                    AND newer.quiz.id = qa.quiz.id
                    AND (
                        newer.attemptedAt > qa.attemptedAt
                        OR (newer.attemptedAt = qa.attemptedAt AND newer.id > qa.id)
                    )
              )
            ORDER BY qa.attemptedAt DESC
            """)
    List<QuizAttempt> findLatestAttemptsPerQuizForStudentAndSubject(
            @Param("studentId") Long studentId, @Param("subjectId") Long subjectId);
}
