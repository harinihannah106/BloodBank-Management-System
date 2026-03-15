package com.bloodbank.service;

import com.bloodbank.dto.DonorProfileDto;
import com.bloodbank.entity.*;
import com.bloodbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonorService {

    @Autowired private DonorRepository donorRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DonationHistoryRepository donationHistoryRepository;
    @Autowired private NotificationRepository notificationRepository;

    @Transactional
    public DonorProfileDto createOrUpdateProfile(String email, DonorProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBloodGroup(dto.getBloodGroup());
        user.setPhone(dto.getPhone());
        user.setCity(dto.getCity());
        user.setProfileCompleted(true);
        userRepository.save(user);

        Donor donor = donorRepository.findByUser(user).orElse(new Donor());
        donor.setUser(user);
        donor.setBloodGroup(dto.getBloodGroup());
        donor.setAge(dto.getAge());
        donor.setWeight(dto.getWeight());
        donor.setCity(dto.getCity());
        donor.setAddress(dto.getAddress());
        donor.setLatitude(dto.getLatitude());
        donor.setLongitude(dto.getLongitude());
        donorRepository.save(donor);

        return toDonorProfileDto(donor);
    }

    public DonorProfileDto getDonorProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Donor profile not found"));
        return toDonorProfileDto(donor);
    }

    @Transactional
    public DonorProfileDto toggleAvailability(String email, boolean available) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Donor profile not found"));
        donor.setAvailable(available);
        donorRepository.save(donor);
        return toDonorProfileDto(donor);
    }

    public List<DonationHistory> getDonationHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Donor profile not found"));
        return donationHistoryRepository.findByDonorOrderByDonationDateDesc(donor);
    }

    public List<Notification> getNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Notification respondToNotification(Long notificationId, boolean accept) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setStatus(accept ? Notification.NotificationStatus.ACCEPTED : Notification.NotificationStatus.DECLINED);
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public List<Donor> getAvailableDonorsByBloodGroup(String bloodGroup) {
        return donorRepository.findAvailableDonorsByBloodGroup(bloodGroup);
    }

    private DonorProfileDto toDonorProfileDto(Donor donor) {
        DonorProfileDto dto = new DonorProfileDto();
        dto.setId(donor.getId());
        dto.setName(donor.getUser().getName());
        dto.setEmail(donor.getUser().getEmail());
        dto.setPhone(donor.getUser().getPhone());
        dto.setBloodGroup(donor.getBloodGroup());
        dto.setAge(donor.getAge());
        dto.setWeight(donor.getWeight());
        dto.setCity(donor.getCity());
        dto.setAddress(donor.getAddress());
        dto.setLatitude(donor.getLatitude());
        dto.setLongitude(donor.getLongitude());
        dto.setAvailable(donor.isAvailable());
        dto.setEligible(donor.isEligible());
        dto.setLastDonationDate(donor.getLastDonationDate());
        dto.setNextEligibleDate(donor.getNextEligibleDate());
        dto.setTotalDonations(donor.getTotalDonations());
        return dto;
    }
}
