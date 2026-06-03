package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.KnowledgeGraphEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeGraphEdgeRepository extends JpaRepository<KnowledgeGraphEdge, Long> {
    List<KnowledgeGraphEdge> findAllBySubjectId(Long subjectId);

    @Modifying
    @Query("DELETE FROM KnowledgeGraphEdge e WHERE e.subject.id = :subjectId")
    void deleteAllBySubjectId(@Param("subjectId") Long subjectId);
}
