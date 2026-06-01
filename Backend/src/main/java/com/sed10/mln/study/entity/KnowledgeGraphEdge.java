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
@Table(name = "knowledge_graph_edge")
public class KnowledgeGraphEdge {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @EqualsAndHashCode.Include Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    Subject subject;

    @Column(name = "react_flow_id", length = 100, nullable = false)
    String reactFlowId;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "source_node_id", nullable = false) KnowledgeGraphNode sourceNode;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "target_node_id", nullable = false) KnowledgeGraphNode targetNode;
    
    @Column(name = "relation_type", length = 50) String relationType;
}
