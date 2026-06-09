package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestion_IdOrderBySortOrderAsc(Long questionId);

    List<Answer> findByQuestion_IdInOrderByQuestion_IdAscSortOrderAsc(Collection<Long> questionIds);

    void deleteByQuestion_Id(Long questionId);
}
