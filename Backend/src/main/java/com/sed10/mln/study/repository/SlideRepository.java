package com.sed10.mln.study.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    Optional<List<Slide>> findAllByMaterialIdWithMaterial(@Param("materialId") Long materialId);

    @Query("SELECT s.material.id, s.imageUrl FROM Slide s WHERE s.slideIndex = 0 AND s.material.id IN :materialIds")
    List<Object[]> findFirstSlideImagesByMaterialIds(@Param("materialIds") List<Long> materialIds);
}
