package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    Optional<User> findByUsername(String username);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE User u SET u.lastSeenAt = :seenAt WHERE u.id = :userId")
    int updateLastSeenAt(@Param("userId") Long userId, @Param("seenAt") LocalDateTime seenAt);

    long countByLastSeenAtAfter(LocalDateTime threshold);
}
