package com.bloodbank.controller;

import com.bloodbank.dto.DonorProfileDto;
import com.bloodbank.service.DonorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/donor")
public class DonorController {

    @Autowired
    private DonorService donorService;

    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(@RequestBody DonorProfileDto dto, Authentication auth) {
        try {
            return ResponseEntity.ok(donorService.createOrUpdateProfile(auth.getName(), dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        try {
            return ResponseEntity.ok(donorService.getDonorProfile(auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/availability")
    public ResponseEntity<?> toggleAvailability(@RequestBody Map<String, Boolean> body, Authentication auth) {
        try {
            return ResponseEntity.ok(donorService.toggleAvailability(auth.getName(), body.get("available")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getDonationHistory(Authentication auth) {
        return ResponseEntity.ok(donorService.getDonationHistory(auth.getName()));
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(Authentication auth) {
        return ResponseEntity.ok(donorService.getNotifications(auth.getName()));
    }

    @PutMapping("/notifications/{id}/respond")
    public ResponseEntity<?> respondNotification(@PathVariable Long id,
                                                  @RequestBody Map<String, Boolean> body) {
        try {
            return ResponseEntity.ok(donorService.respondToNotification(id, body.get("accept")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
