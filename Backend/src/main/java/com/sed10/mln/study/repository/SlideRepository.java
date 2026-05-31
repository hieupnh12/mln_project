package com.sed10.mln.study.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sed10.mln.study.entity.Slide;

@Repository
public interface SlideRepository extends JpaRepository<Slide, Long> {

    List<Slide> findByMaterialIdOrderBySlideIndexAsc(Long materialId);

    Optional<Slide> findFirstByMaterialIdOrderBySlideIndexAsc(Long materialId);

    void deleteByMaterialId(Long materialId);

    @Query("""
            SELECT s FROM Slide s
            JOIN FETCH s.material m
            WHERE m.id = :materialId
            ORDER BY s.slideIndex ASC
            """)
    Optional<List<Slide>> findAllByMaterialIdWithMaterial(Long materialId);
}
