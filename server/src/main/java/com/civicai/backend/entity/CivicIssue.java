package com.civicai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "civic_issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CivicIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category; // POTHOLE, ILLEGAL_CONSTRUCTION, WATERLOGGING, GARBAGE_DUMP, FALLEN_TREE, STREETLIGHT_DAMAGE, OTHER

    @Column(nullable = false)
    private String urgency; // CRITICAL, HIGH, MEDIUM, LOW

    private Double aiConfidence; // e.g. 0.94 (94%)

    @Column(columnDefinition = "TEXT")
    private String aiReasoning; // AI analysis breakdown explaining severity and hazards

    private String detectedHazards; // Comma separated: e.g. "Traffic Obstruction, Pedestrian Hazard, Structural Threat"

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;

    @Column(nullable = false)
    private String wardNumber; // e.g. "Ward 104 - Koramangala / Indiranagar"

    private String wardOfficeName;

    private String wardOfficerEmail;

    private String wardOfficerPhone;

    @Column(columnDefinition = "TEXT")
    private String imageUrl; // Image URL or base64 data URI

    @Column(columnDefinition = "TEXT")
    private String resolvedImageUrl; // Post-resolution proof image

    @Column(nullable = false)
    private String status; // REPORTED, IN_REVIEW, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED

    private String citizenName;
    private String citizenPhone;
    private String citizenEmail;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    private Integer upvotes;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "REPORTED";
        }
        if (this.upvotes == null) {
            this.upvotes = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
