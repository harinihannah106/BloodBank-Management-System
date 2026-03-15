package com.bloodbank.repository;

import com.bloodbank.entity.Donor;
import com.bloodbank.entity.DonationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
    List<DonationHistory> findByDonorOrderByDonationDateDesc(Donor donor);

    @Query("SELECT MONTH(d.donationDate), COUNT(d) FROM DonationHistory d WHERE YEAR(d.donationDate) = YEAR(NOW()) GROUP BY MONTH(d.donationDate)")
    List<Object[]> monthlyDonationTrend();
}
