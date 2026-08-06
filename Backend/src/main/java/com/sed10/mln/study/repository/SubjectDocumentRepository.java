package com.sed10.mln.study.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sed10.mln.study.entity.SubjectDocument;

@Repository
public interface SubjectDocumentRepository extends JpaRepository<SubjectDocument, Long> {

    @Query("""
            SELECT d FROM SubjectDocument d
            JOIN FETCH d.subject s
            ORDER BY s.title ASC, d.createdAt DESC, d.title ASC
            """)
    List<SubjectDocument> findAllWithSubject();

    @Query("""
            SELECT d FROM SubjectDocument d
            JOIN FETCH d.subject s
            WHERE s.id = :subjectId
            ORDER BY d.createdAt DESC, d.title ASC
            """)
    List<SubjectDocument> findBySubjectIdWithSubject(Long subjectId);

    @Query("""
            SELECT d FROM SubjectDocument d
            JOIN FETCH d.subject s
            WHERE d.id = :documentId
            """)
    Optional<SubjectDocument> findByIdWithSubject(Long documentId);
}
