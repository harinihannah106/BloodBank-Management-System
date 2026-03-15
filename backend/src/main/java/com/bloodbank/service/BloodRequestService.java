package com.bloodbank.service;

import com.bloodbank.dto.BloodRequestDto;
import com.bloodbank.entity.*;
import com.bloodbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodRequestService {

    @Autowired private BloodRequestRepository bloodRequestRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DonorRepository donorRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private BloodStockRepository bloodStockRepository;
    @Autowired private DonationHistoryRepository donationHistoryRepository;

    @Transactional
    public BloodRequestDto createRequest(String email, BloodRequestDto dto) {
        User recipient = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BloodRequest request = new BloodRequest();
        request.setRecipient(recipient);
        request.setBloodGroup(dto.getBloodGroup());
        request.setUnits(dto.getUnits());
        request.setHospitalName(dto.getHospitalName());
        request.setContactNumber(dto.getContactNumber());
        request.setUrgency(dto.getUrgency());
        request.setRequiredDate(dto.getRequiredDate());
        request.setNotes(dto.getNotes());
        BloodRequest saved = bloodRequestRepository.save(request);

        // Notify available donors
        notifyDonors(saved);

        return toDto(saved);
    }

    private void notifyDonors(BloodRequest request) {
        List<Donor> donors = donorRepository.findAvailableDonorsByBloodGroup(request.getBloodGroup());
        for (Donor donor : donors) {
            Notification notification = new Notification();
            notification.setUser(donor.getUser());
            notification.setBloodRequest(request);
            notification.setMessage("Blood request: " + request.getBloodGroup() + " needed at " + request.getHospitalName());
            notification.setHospitalName(request.getHospitalName());
            notification.setBloodGroup(request.getBloodGroup());
            notification.setDistance(2.0 + Math.random() * 10); // Simulated
            notification.setUrgency(request.getUrgency());
            notificationRepository.save(notification);
        }
    }

    public List<BloodRequestDto> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bloodRequestRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<BloodRequestDto> getAllRequests() {
        return bloodRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public BloodRequestDto approveRequest(Long id) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(BloodRequest.RequestStatus.APPROVED);
        request.setUpdatedAt(LocalDateTime.now());

        // Deduct from stock
        bloodStockRepository.findByBloodGroup(request.getBloodGroup()).ifPresent(stock -> {
            stock.setUnits(Math.max(0, stock.getUnits() - request.getUnits()));
            stock.setUpdatedAt(LocalDateTime.now());
            bloodStockRepository.save(stock);
        });

        return toDto(bloodRequestRepository.save(request));
    }

    @Transactional
    public BloodRequestDto rejectRequest(Long id) {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(BloodRequest.RequestStatus.REJECTED);
        request.setUpdatedAt(LocalDateTime.now());
        return toDto(bloodRequestRepository.save(request));
    }

    @Transactional
    public BloodRequestDto assignDonor(Long requestId, Long donorId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        request.setAssignedDonor(donor);
        request.setStatus(BloodRequest.RequestStatus.DONOR_ASSIGNED);
        request.setUpdatedAt(LocalDateTime.now());

        // Record donation history
        DonationHistory history = new DonationHistory();
        history.setDonor(donor);
        history.setBloodRequest(request);
        history.setHospitalName(request.getHospitalName());
        history.setUnits(request.getUnits());
        history.setDonationDate(LocalDate.now());
        donationHistoryRepository.save(history);

        // Update donor
        donor.setLastDonationDate(LocalDate.now());
        donor.setNextEligibleDate(LocalDate.now().plusDays(90));
        donor.setTotalDonations(donor.getTotalDonations() + 1);
        donor.setEligible(false);
        donorRepository.save(donor);

        return toDto(bloodRequestRepository.save(request));
    }

    public List<Donor> getSuggestedDonors(String bloodGroup) {
        return donorRepository.findAvailableDonorsByBloodGroup(bloodGroup);
    }

    private BloodRequestDto toDto(BloodRequest r) {
        BloodRequestDto dto = new BloodRequestDto();
        dto.setId(r.getId());
        dto.setBloodGroup(r.getBloodGroup());
        dto.setUnits(r.getUnits());
        dto.setHospitalName(r.getHospitalName());
        dto.setContactNumber(r.getContactNumber());
        dto.setUrgency(r.getUrgency());
        dto.setStatus(r.getStatus());
        dto.setRequiredDate(r.getRequiredDate());
        dto.setNotes(r.getNotes());
        dto.setCreatedAt(r.getCreatedAt());
        if (r.getRecipient() != null) dto.setRecipientName(r.getRecipient().getName());
        if (r.getAssignedDonor() != null) dto.setAssignedDonorName(r.getAssignedDonor().getUser().getName());
        return dto;
    }
}
