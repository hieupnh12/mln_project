package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "user")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;
    @Column(length = 50) String username;
    @Column(name = "password_hash", length = 255) String passwordHash;
    @Column(length = 100) String email;
    @Column(name = "full_name", length = 100) String fullName;
    @Column(length = 20) String role;
    @Column(name = "is_active") Boolean isActive;
}
