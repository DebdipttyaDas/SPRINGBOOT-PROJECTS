package com.civicai.backend.service;

import com.civicai.backend.dto.AiAnalysisResult;
import com.civicai.backend.dto.DashboardStats;
import com.civicai.backend.entity.CivicIssue;
import com.civicai.backend.entity.CivicWard;
import com.civicai.backend.repository.CivicIssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CivicIssueService {

    @Autowired
    private CivicIssueRepository issueRepository;

    @Autowired
    private AiCategorizationService aiCategorizationService;

    @Autowired
    private WardRoutingService wardRoutingService;

    public List<CivicIssue> getAllIssues() {
        return issueRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<CivicIssue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    public List<CivicIssue> getIssuesByWard(String wardNumber) {
        return issueRepository.findByWardNumberOrderByCreatedAtDesc(wardNumber);
    }

    public List<CivicIssue> getIssuesByCategory(String category) {
        return issueRepository.findByCategoryIgnoreCase(category);
    }

    public List<CivicIssue> getIssuesByUrgency(String urgency) {
        return issueRepository.findByUrgencyIgnoreCase(urgency);
    }

    public List<CivicIssue> getIssuesByStatus(String status) {
        return issueRepository.findByStatusIgnoreCase(status);
    }

    public CivicIssue createIssue(CivicIssue issue) {
        // Run AI Analysis if not already filled or if auto requested
        AiAnalysisResult aiResult = aiCategorizationService.analyzeIssue(
                issue.getTitle(),
                issue.getDescription(),
                issue.getCategory(),
                issue.getImageUrl()
        );

        if (issue.getCategory() == null || "AUTO_DETECT".equalsIgnoreCase(issue.getCategory())) {
            issue.setCategory(aiResult.getCategory());
        }
        if (issue.getUrgency() == null || issue.getUrgency().isBlank()) {
            issue.setUrgency(aiResult.getUrgency());
        }
        if (issue.getAiConfidence() == null) {
            issue.setAiConfidence(aiResult.getConfidence());
        }
        if (issue.getAiReasoning() == null) {
            issue.setAiReasoning(aiResult.getReasoning());
        }
        if (issue.getDetectedHazards() == null) {
            issue.setDetectedHazards(aiResult.getDetectedHazards());
        }

        // Automatic Ward Geo-Routing if latitude and longitude are supplied
        if (issue.getLatitude() != null && issue.getLongitude() != null) {
            CivicWard routedWard = wardRoutingService.routeToClosestWard(issue.getLatitude(), issue.getLongitude());
            if (routedWard != null) {
                if (issue.getWardNumber() == null || issue.getWardNumber().isBlank()) {
                    issue.setWardNumber(routedWard.getWardNumber());
                }
                if (issue.getWardOfficeName() == null) {
                    issue.setWardOfficeName(routedWard.getWardName() + " (" + routedWard.getZoneName() + ")");
                }
                if (issue.getWardOfficerEmail() == null) {
                    issue.setWardOfficerEmail(routedWard.getOfficerEmail());
                }
                if (issue.getWardOfficerPhone() == null) {
                    issue.setWardOfficerPhone(routedWard.getOfficerPhone());
                }
            }
        }

        if (issue.getStatus() == null) {
            issue.setStatus("ASSIGNED");
        }

        return issueRepository.save(issue);
    }

    public CivicIssue updateStatus(Long id, String newStatus, String resolvedImageUrl) {
        CivicIssue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Civic Issue not found with ID: " + id));

        issue.setStatus(newStatus.toUpperCase());
        if ("RESOLVED".equalsIgnoreCase(newStatus)) {
            issue.setResolvedAt(LocalDateTime.now());
            if (resolvedImageUrl != null && !resolvedImageUrl.isBlank()) {
                issue.setResolvedImageUrl(resolvedImageUrl);
            }
        }
        return issueRepository.save(issue);
    }

    public CivicIssue upvoteIssue(Long id) {
        CivicIssue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Civic Issue not found with ID: " + id));
        issue.setUpvotes((issue.getUpvotes() != null ? issue.getUpvotes() : 0) + 1);
        return issueRepository.save(issue);
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        List<CivicIssue> all = issueRepository.findAll();

        stats.setTotalReports(all.size());
        stats.setPendingReports(all.stream().filter(i -> "REPORTED".equalsIgnoreCase(i.getStatus()) || "ASSIGNED".equalsIgnoreCase(i.getStatus()) || "IN_REVIEW".equalsIgnoreCase(i.getStatus())).count());
        stats.setInProgressReports(all.stream().filter(i -> "IN_PROGRESS".equalsIgnoreCase(i.getStatus())).count());
        stats.setResolvedReports(all.stream().filter(i -> "RESOLVED".equalsIgnoreCase(i.getStatus())).count());
        stats.setCriticalUrgencyCount(all.stream().filter(i -> "CRITICAL".equalsIgnoreCase(i.getUrgency())).count());

        stats.setCategoryBreakdown(all.stream().collect(Collectors.groupingBy(CivicIssue::getCategory, Collectors.counting())));
        stats.setUrgencyBreakdown(all.stream().collect(Collectors.groupingBy(CivicIssue::getUrgency, Collectors.counting())));
        stats.setStatusBreakdown(all.stream().collect(Collectors.groupingBy(CivicIssue::getStatus, Collectors.counting())));
        stats.setWardBreakdown(all.stream().collect(Collectors.groupingBy(CivicIssue::getWardNumber, Collectors.counting())));

        return stats;
    }
}
