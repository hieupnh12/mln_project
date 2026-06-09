package com.sed10.mln.study.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sed10.mln.study.entity.Chapter;
import com.sed10.mln.study.entity.Subject;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    List<Chapter> findAllBySubject(Subject subject);

    Optional<Chapter> findFirstBySubject_IdAndTitle(Long subjectId, String title);

}
