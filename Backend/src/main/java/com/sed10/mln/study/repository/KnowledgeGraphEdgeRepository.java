package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.KnowledgeGraphEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeGraphEdgeRepository extends JpaRepository<KnowledgeGraphEdge, Long> {
    List<KnowledgeGraphEdge> findAllBySubjectId(Long subjectId);
    void deleteAllBySubjectId(Long subjectId);
}
