package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.QuestionTag;
import com.sed10.mln.study.entity.QuestionTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface QuestionTagRepository extends JpaRepository<QuestionTag, QuestionTagId> {
    List<QuestionTag> findByQuestion_Id(Long questionId);

    @Query("select qt from QuestionTag qt join fetch qt.tag where qt.question.id in :questionIds")
    List<QuestionTag> findByQuestion_IdIn(@Param("questionIds") Collection<Long> questionIds);

    void deleteByQuestion_Id(Long questionId);
}

