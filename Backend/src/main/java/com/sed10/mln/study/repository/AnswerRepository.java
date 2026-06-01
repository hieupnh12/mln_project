package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestion_IdOrderBySortOrderAsc(Long questionId);

    void deleteByQuestion_Id(Long questionId);
}
