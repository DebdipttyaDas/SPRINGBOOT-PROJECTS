package com.civicai.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DashboardStats {
    private long totalReports;
    private long pendingReports;
    private long inProgressReports;
    private long resolvedReports;
    private long criticalUrgencyCount;
    private Map<String, Long> categoryBreakdown;
    private Map<String, Long> urgencyBreakdown;
    private Map<String, Long> statusBreakdown;
    private Map<String, Long> wardBreakdown;
}
