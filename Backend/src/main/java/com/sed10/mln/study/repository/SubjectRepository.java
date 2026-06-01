package com.sed10.mln.study.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sed10.mln.study.entity.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {


    List<Subject> findBySubjectCode(String subjectCode);

}
