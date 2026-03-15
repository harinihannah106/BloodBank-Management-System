package com.bloodbank.dto;

import com.bloodbank.entity.BloodRequest;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BloodRequestDto {
    private Long id;
    private String bloodGroup;
    private int units;
    private String hospitalName;
    private String contactNumber;
    private BloodRequest.UrgencyLevel urgency;
    private BloodRequest.RequestStatus status;
    private LocalDate requiredDate;
    private String notes;
    private String recipientName;
    private String assignedDonorName;
    private LocalDateTime createdAt;

    public BloodRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public int getUnits() { return units; }
    public void setUnits(int units) { this.units = units; }
    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public BloodRequest.UrgencyLevel getUrgency() { return urgency; }
    public void setUrgency(BloodRequest.UrgencyLevel urgency) { this.urgency = urgency; }
    public BloodRequest.RequestStatus getStatus() { return status; }
    public void setStatus(BloodRequest.RequestStatus status) { this.status = status; }
    public LocalDate getRequiredDate() { return requiredDate; }
    public void setRequiredDate(LocalDate requiredDate) { this.requiredDate = requiredDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public String getAssignedDonorName() { return assignedDonorName; }
    public void setAssignedDonorName(String assignedDonorName) { this.assignedDonorName = assignedDonorName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
