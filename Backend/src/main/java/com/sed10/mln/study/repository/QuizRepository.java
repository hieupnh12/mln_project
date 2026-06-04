package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long>, JpaSpecificationExecutor<Quiz> {
    @Query("""
            SELECT DISTINCT q FROM Quiz q
            LEFT JOIN FETCH q.subject
            LEFT JOIN FETCH q.chapter
            LEFT JOIN FETCH q.lesson
            WHERE q.subject.id = :subjectId AND q.status = :status
            ORDER BY q.updatedAt DESC
            """)
    List<Quiz> findPublishedCatalogBySubjectId(
            @Param("subjectId") Long subjectId, @Param("status") String status);
}
