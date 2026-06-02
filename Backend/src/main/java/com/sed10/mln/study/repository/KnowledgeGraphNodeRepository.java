package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.KnowledgeGraphNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeGraphNodeRepository extends JpaRepository<KnowledgeGraphNode, Long> {
    List<KnowledgeGraphNode> findAllBySubjectId(Long subjectId);

    @Modifying
    @Query("DELETE FROM KnowledgeGraphNode n WHERE n.subject.id = :subjectId")
    void deleteAllBySubjectId(@Param("subjectId") Long subjectId);
}
