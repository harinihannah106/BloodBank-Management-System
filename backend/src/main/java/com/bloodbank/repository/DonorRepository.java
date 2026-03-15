package com.bloodbank.repository;

import com.bloodbank.entity.Donor;
import com.bloodbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByUser(User user);
    Optional<Donor> findByUserId(Long userId);
    List<Donor> findByBloodGroupAndAvailableAndEligible(String bloodGroup, boolean available, boolean eligible);
    List<Donor> findByAvailable(boolean available);

    @Query("SELECT COUNT(d) FROM Donor d WHERE d.available = true AND d.eligible = true")
    long countActiveDonors();

    @Query("SELECT d FROM Donor d WHERE d.bloodGroup = :bg AND d.available = true AND d.eligible = true")
List<Donor> findAvailableDonorsByBloodGroup(@Param("bg") String bloodGroup);
}
