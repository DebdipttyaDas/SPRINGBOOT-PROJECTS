package com.civicai.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResult {
    private String category;
    private String urgency;
    private Double confidence;
    private String reasoning;
    private String detectedHazards;
    private String recommendedDepartment;
    private Integer estimatedResolutionHours;
}
