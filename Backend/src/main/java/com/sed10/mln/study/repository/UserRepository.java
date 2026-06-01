package com.sed10.mln.study.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sed10.mln.study.entity.User;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
}
