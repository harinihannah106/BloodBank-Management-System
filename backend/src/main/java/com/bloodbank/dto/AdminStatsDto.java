package com.bloodbank.dto;

import java.util.List;
import java.util.Map;

public class AdminStatsDto {
    private long totalDonors;
    private long activeDonors;
    private long totalStockUnits;
    private long criticalCasesToday;
    private double avgResponseTime;
    private long totalRequests;
    private long pendingRequests;
    private Map<String, Integer> bloodGroupStock;
    private List<Map<String, Object>> monthlyTrend;
    private Map<String, Long> urgencyDistribution;

    public AdminStatsDto() {}

    public long getTotalDonors() { return totalDonors; }
    public void setTotalDonors(long totalDonors) { this.totalDonors = totalDonors; }
    public long getActiveDonors() { return activeDonors; }
    public void setActiveDonors(long activeDonors) { this.activeDonors = activeDonors; }
    public long getTotalStockUnits() { return totalStockUnits; }
    public void setTotalStockUnits(long totalStockUnits) { this.totalStockUnits = totalStockUnits; }
    public long getCriticalCasesToday() { return criticalCasesToday; }
    public void setCriticalCasesToday(long criticalCasesToday) { this.criticalCasesToday = criticalCasesToday; }
    public double getAvgResponseTime() { return avgResponseTime; }
    public void setAvgResponseTime(double avgResponseTime) { this.avgResponseTime = avgResponseTime; }
    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }
    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }
    public Map<String, Integer> getBloodGroupStock() { return bloodGroupStock; }
    public void setBloodGroupStock(Map<String, Integer> bloodGroupStock) { this.bloodGroupStock = bloodGroupStock; }
    public List<Map<String, Object>> getMonthlyTrend() { return monthlyTrend; }
    public void setMonthlyTrend(List<Map<String, Object>> monthlyTrend) { this.monthlyTrend = monthlyTrend; }
    public Map<String, Long> getUrgencyDistribution() { return urgencyDistribution; }
    public void setUrgencyDistribution(Map<String, Long> urgencyDistribution) { this.urgencyDistribution = urgencyDistribution; }
}
