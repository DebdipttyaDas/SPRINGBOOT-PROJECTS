package com.civicai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "civic_wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CivicWard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String wardNumber;

    @Column(nullable = false)
    private String wardName;

    private String zoneName; // e.g. "East Zone", "South Zone", "Central Zone"

    private String officerName;
    private String officerEmail;
    private String officerPhone;
    private String officeAddress;

    private Double centerLat;
    private Double centerLng;
    private Double radiusKm; // Approximate ward boundary radius for polygon distance calculation
}
