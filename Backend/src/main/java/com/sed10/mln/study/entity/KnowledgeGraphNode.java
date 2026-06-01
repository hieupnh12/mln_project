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
@Table(name = "knowledge_graph_node")
public class KnowledgeGraphNode {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;
    @Column(name = "entity_type", length = 50) String entityType;
    @Column(name = "entity_id") Long entityId;
    @Column(name = "pos_x") Float posX;
    @Column(name = "pos_y") Float posY;
    @Column(length = 7) String color;
    @Column(name = "is_root") Boolean isRoot;
}
