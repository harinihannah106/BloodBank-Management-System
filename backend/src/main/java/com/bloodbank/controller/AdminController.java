package com.bloodbank.controller;

import com.bloodbank.service.AdminService;
import com.bloodbank.service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private BloodRequestService bloodRequestService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/donors")
    public ResponseEntity<?> getAllDonors() {
        return ResponseEntity.ok(adminService.getAllDonors());
    }

    @GetMapping("/recipients")
    public ResponseEntity<?> getAllRecipients() {
        return ResponseEntity.ok(adminService.getAllRecipients());
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.blockUser(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.unblockUser(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bloodRequestService.approveRequest(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bloodRequestService.rejectRequest(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/requests/{requestId}/assign-donor/{donorId}")
    public ResponseEntity<?> assignDonor(@PathVariable Long requestId, @PathVariable Long donorId) {
        try {
            return ResponseEntity.ok(bloodRequestService.assignDonor(requestId, donorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stock")
    public ResponseEntity<?> getStock() {
        return ResponseEntity.ok(adminService.getAllStock());
    }

    @PutMapping("/stock/{bloodGroup}")
    public ResponseEntity<?> updateStock(@PathVariable String bloodGroup, @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(adminService.updateStock(bloodGroup, body.get("units")));
    }

    @PostMapping("/stock/initialize")
    public ResponseEntity<?> initializeStock() {
        adminService.initializeStock();
        return ResponseEntity.ok(Map.of("message", "Stock initialized"));
    }
}
