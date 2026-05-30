package com.sed10.mln.study.repository;

import com.sed10.mln.study.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}
