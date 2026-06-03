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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    Subject subject;

    @Column(name = "react_flow_id", length = 100, nullable = false)
    String reactFlowId;

    @Column(name = "react_flow_type", length = 50)
    String reactFlowType;

    @Column(length = 255)
    String title;

    @Column(name = "entity_type", length = 50) String entityType;
    @Column(name = "entity_id") Long entityId;
    
    @Column(name = "pos_x") Float posX;
    @Column(name = "pos_y") Float posY;
    
    @Column(length = 7) String color;
    @Column(name = "is_root") Boolean isRoot;
}
