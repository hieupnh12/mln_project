package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.QuestionTag;
import com.sed10.mln.study.entity.QuestionTagId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionTagRepository extends JpaRepository<QuestionTag, QuestionTagId> {
    List<QuestionTag> findByQuestion_Id(Long questionId);

    void deleteByQuestion_Id(Long questionId);
}
