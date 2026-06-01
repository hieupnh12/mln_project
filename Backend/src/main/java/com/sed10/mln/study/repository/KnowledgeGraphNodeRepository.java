package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.KnowledgeGraphNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeGraphNodeRepository extends JpaRepository<KnowledgeGraphNode, Long> {
    List<KnowledgeGraphNode> findAllBySubjectId(Long subjectId);
    void deleteAllBySubjectId(Long subjectId);
}
