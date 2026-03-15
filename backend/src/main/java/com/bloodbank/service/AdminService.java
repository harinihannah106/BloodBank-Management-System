package com.bloodbank.service;

import com.bloodbank.dto.AdminStatsDto;
import com.bloodbank.entity.*;
import com.bloodbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private DonorRepository donorRepository;
    @Autowired private BloodRequestRepository bloodRequestRepository;
    @Autowired private BloodStockRepository bloodStockRepository;
    @Autowired private DonationHistoryRepository donationHistoryRepository;

    public AdminStatsDto getDashboardStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalDonors(userRepository.findByRole(User.Role.DONOR).size());
        stats.setActiveDonors(donorRepository.countActiveDonors());

        List<BloodStock> stocks = bloodStockRepository.findAll();
        long totalUnits = stocks.stream().mapToLong(BloodStock::getUnits).sum();
        stats.setTotalStockUnits(totalUnits);

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        stats.setCriticalCasesToday(bloodRequestRepository.countCriticalToday(todayStart));
        stats.setAvgResponseTime(2.5);
        stats.setTotalRequests(bloodRequestRepository.count());
        stats.setPendingRequests(bloodRequestRepository.findByStatus(BloodRequest.RequestStatus.PENDING).size());

        // Blood group stock map
        Map<String, Integer> bgStock = new LinkedHashMap<>();
        stocks.forEach(s -> bgStock.put(s.getBloodGroup(), s.getUnits()));
        stats.setBloodGroupStock(bgStock);

        // Monthly trend
        List<Object[]> trend = donationHistoryRepository.monthlyDonationTrend();
        List<Map<String, Object>> monthlyTrend = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        Map<Integer, Long> trendMap = new HashMap<>();
        trend.forEach(row -> trendMap.put((Integer) row[0], (Long) row[1]));
        for (int i = 1; i <= 12; i++) {
            Map<String, Object> m = new HashMap<>();
            m.put("month", months[i-1]);
            m.put("donations", trendMap.getOrDefault(i, 0L));
            monthlyTrend.add(m);
        }
        stats.setMonthlyTrend(monthlyTrend);

        // Urgency distribution
        Map<String, Long> urgency = new LinkedHashMap<>();
        bloodRequestRepository.countByUrgency().forEach(row -> urgency.put(row[0].toString(), (Long) row[1]));
        stats.setUrgencyDistribution(urgency);

        return stats;
    }

    public List<User> getAllDonors() {
        return userRepository.findByRole(User.Role.DONOR);
    }

    public List<User> getAllRecipients() {
        return userRepository.findByRole(User.Role.RECIPIENT);
    }

    @Transactional
    public User blockUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(true);
        user.setActive(false);
        return userRepository.save(user);
    }

    @Transactional
    public User unblockUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(false);
        user.setActive(true);
        return userRepository.save(user);
    }

    public List<BloodStock> getAllStock() {
        return bloodStockRepository.findAll();
    }

    @Transactional
    public BloodStock updateStock(String bloodGroup, int units) {
        BloodStock stock = bloodStockRepository.findByBloodGroup(bloodGroup).orElse(new BloodStock());
        if (stock.getBloodGroup() == null) stock.setBloodGroup(bloodGroup);
        stock.setUnits(units);
        stock.setUpdatedAt(LocalDateTime.now());
        return bloodStockRepository.save(stock);
    }

    @Transactional
    public void initializeStock() {
        String[] bloodGroups = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        for (String bg : bloodGroups) {
            if (bloodStockRepository.findByBloodGroup(bg).isEmpty()) {
                BloodStock stock = new BloodStock();
                stock.setBloodGroup(bg);
                stock.setUnits(0);
                bloodStockRepository.save(stock);
            }
        }
    }
}
