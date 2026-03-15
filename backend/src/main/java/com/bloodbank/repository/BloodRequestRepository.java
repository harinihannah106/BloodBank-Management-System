package com.bloodbank.repository;

import com.bloodbank.entity.BloodRequest;
import com.bloodbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByRecipient(User recipient);
    List<BloodRequest> findByStatus(BloodRequest.RequestStatus status);
    List<BloodRequest> findByRecipientOrderByCreatedAtDesc(User recipient);

    @Query("SELECT COUNT(r) FROM BloodRequest r WHERE r.urgency = 'EMERGENCY' AND r.createdAt >= :since")
    long countCriticalToday(LocalDateTime since);

    @Query("SELECT r.bloodGroup, COUNT(r) FROM BloodRequest r GROUP BY r.bloodGroup")
    List<Object[]> countByBloodGroup();

    @Query("SELECT MONTH(r.createdAt), COUNT(r) FROM BloodRequest r WHERE YEAR(r.createdAt) = YEAR(NOW()) GROUP BY MONTH(r.createdAt)")
    List<Object[]> monthlyRequestTrend();

    @Query("SELECT r.urgency, COUNT(r) FROM BloodRequest r GROUP BY r.urgency")
    List<Object[]> countByUrgency();

    List<BloodRequest> findAllByOrderByCreatedAtDesc();
}
