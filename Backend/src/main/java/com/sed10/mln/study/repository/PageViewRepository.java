package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.PageView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PageViewRepository extends JpaRepository<PageView, Long> {
    long countByViewedAtAfter(LocalDateTime from);

    long countByViewedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query(value = """
            SELECT DATE(viewed_at) AS view_date, COUNT(*) AS view_count
            FROM page_view
            WHERE viewed_at >= :from
            GROUP BY DATE(viewed_at)
            ORDER BY view_date ASC
            """, nativeQuery = true)
    List<Object[]> countDailyViewsSince(@Param("from") LocalDateTime from);

    @Query(value = """
            SELECT path, COUNT(*) AS view_count
            FROM page_view
            WHERE viewed_at >= :from
            GROUP BY path
            ORDER BY view_count DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<Object[]> findTopPathsSince(@Param("from") LocalDateTime from, @Param("limit") int limit);

    @Query(value = """
            SELECT COUNT(DISTINCT COALESCE(CAST(user_id AS CHAR), viewer_key))
            FROM page_view
            WHERE viewed_at >= :from
              AND (user_id IS NOT NULL OR (viewer_key IS NOT NULL AND viewer_key <> ''))
            """, nativeQuery = true)
    long countUniqueViewersSince(@Param("from") LocalDateTime from);

    @Query(value = """
            SELECT pv.path, pv.viewed_at, u.full_name, u.email, u.role
            FROM page_view pv
            LEFT JOIN user u ON u.id = pv.user_id
            WHERE pv.viewed_at >= :from
            ORDER BY pv.viewed_at DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<Object[]> findRecentViewsSince(@Param("from") LocalDateTime from, @Param("limit") int limit);

    @Query(value = """
            SELECT u.id, u.full_name, u.email, u.role, u.last_seen_at, (
                SELECT pv.path
                FROM page_view pv
                WHERE pv.user_id = u.id
                ORDER BY pv.viewed_at DESC
                LIMIT 1
            ) AS last_path
            FROM user u
            WHERE u.last_seen_at >= :threshold
            ORDER BY u.last_seen_at DESC
            """, nativeQuery = true)
    List<Object[]> findOnlineUserActivities(@Param("threshold") LocalDateTime threshold);
}
