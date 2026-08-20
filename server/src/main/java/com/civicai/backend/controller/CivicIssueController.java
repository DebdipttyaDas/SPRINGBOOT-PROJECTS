package com.civicai.backend.controller;

import com.civicai.backend.dto.AiAnalysisResult;
import com.civicai.backend.dto.DashboardStats;
import com.civicai.backend.entity.CivicIssue;
import com.civicai.backend.entity.CivicWard;
import com.civicai.backend.service.AiCategorizationService;
import com.civicai.backend.service.CivicIssueService;
import com.civicai.backend.service.WardRoutingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CivicIssueController {

    @Autowired
    private CivicIssueService issueService;

    @Autowired
    private AiCategorizationService aiCategorizationService;

    @Autowired
    private WardRoutingService wardRoutingService;

    @GetMapping("/issues")
    public ResponseEntity<List<CivicIssue>> getAllIssues(
            @RequestParam(required = false) String ward,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String urgency,
            @RequestParam(required = false) String status) {

        if (ward != null && !ward.isBlank()) {
            return ResponseEntity.ok(issueService.getIssuesByWard(ward));
        }
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(issueService.getIssuesByCategory(category));
        }
        if (urgency != null && !urgency.isBlank()) {
            return ResponseEntity.ok(issueService.getIssuesByUrgency(urgency));
        }
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(issueService.getIssuesByStatus(status));
        }
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @GetMapping("/issues/{id}")
    public ResponseEntity<CivicIssue> getIssueById(@PathVariable Long id) {
        return issueService.getIssueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/issues")
    public ResponseEntity<CivicIssue> createIssue(@RequestBody CivicIssue issue) {
        CivicIssue saved = issueService.createIssue(issue);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/issues/{id}/status")
    public ResponseEntity<CivicIssue> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        String resolvedImageUrl = payload.get("resolvedImageUrl");
        return ResponseEntity.ok(issueService.updateStatus(id, newStatus, resolvedImageUrl));
    }

    @PostMapping("/issues/{id}/upvote")
    public ResponseEntity<CivicIssue> upvote(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.upvoteIssue(id));
    }

    @PostMapping("/ai/analyze")
    public ResponseEntity<AiAnalysisResult> analyzeIssue(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String description = payload.get("description");
        String categoryHint = payload.get("categoryHint");
        String imageBase64 = payload.get("imageBase64");

        AiAnalysisResult result = aiCategorizationService.analyzeIssue(title, description, categoryHint, imageBase64);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/wards")
    public ResponseEntity<List<CivicWard>> getAllWards() {
        return ResponseEntity.ok(wardRoutingService.getAllWards());
    }

    @GetMapping("/wards/route")
    public ResponseEntity<CivicWard> routeLocation(
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(wardRoutingService.routeToClosestWard(lat, lng));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        return ResponseEntity.ok(issueService.getDashboardStats());
    }
}
