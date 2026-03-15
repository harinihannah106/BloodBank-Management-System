package com.bloodbank.controller;

import com.bloodbank.dto.BloodRequestDto;
import com.bloodbank.service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recipient")
public class RecipientController {

    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody BloodRequestDto dto, Authentication auth) {
        try {
            return ResponseEntity.ok(bloodRequestService.createRequest(auth.getName(), dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getMyRequests(Authentication auth) {
        return ResponseEntity.ok(bloodRequestService.getMyRequests(auth.getName()));
    }

    @GetMapping("/donors/suggest")
public ResponseEntity<?> getSuggestedDonors(@RequestParam String bloodGroup) {
    try {
        String decodedBloodGroup = java.net.URLDecoder.decode(bloodGroup, java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok(bloodRequestService.getSuggestedDonors(decodedBloodGroup));
    } catch (Exception e) {
        return ResponseEntity.ok(bloodRequestService.getSuggestedDonors(bloodGroup));
    }
}
}
