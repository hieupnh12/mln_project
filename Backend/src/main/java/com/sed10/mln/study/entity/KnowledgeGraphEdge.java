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
@Table(name = "Knowledge_Graph_Edge")
public class KnowledgeGraphEdge {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;
    @ManyToOne @JoinColumn(name = "source_node_id") KnowledgeGraphNode sourceNode;
    @ManyToOne @JoinColumn(name = "target_node_id") KnowledgeGraphNode targetNode;
    @Column(name = "relation_type", length = 50) String relationType;
}
