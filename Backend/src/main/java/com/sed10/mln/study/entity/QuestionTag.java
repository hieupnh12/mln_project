package com.sed10.mln.study.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "questionTag")
public class QuestionTag {
    @EmbeddedId QuestionTagId id;

    @ManyToOne @MapsId("questionId") @JoinColumn(name = "question_id") Question question;
    @ManyToOne @MapsId("tagId") @JoinColumn(name = "tag_id") Tag tag;
}
