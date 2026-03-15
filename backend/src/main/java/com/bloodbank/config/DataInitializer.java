package com.bloodbank.config;

import com.bloodbank.entity.*;
import com.bloodbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private BloodStockRepository bloodStockRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin user
        if (!userRepository.existsByEmail("admin@bloodbank.com")) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@bloodbank.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setProfileCompleted(true);
            userRepository.save(admin);
            System.out.println("Admin user created: admin@bloodbank.com / admin123");
        }

        // Initialize blood stock
        String[] bloodGroups = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        int[] initialUnits = {150, 45, 120, 38, 65, 20, 200, 55};
        for (int i = 0; i < bloodGroups.length; i++) {
            String bg = bloodGroups[i];
            if (bloodStockRepository.findByBloodGroup(bg).isEmpty()) {
                BloodStock stock = new BloodStock();
                stock.setBloodGroup(bg);
                stock.setUnits(initialUnits[i]);
                stock.setUpdatedAt(LocalDateTime.now());
                bloodStockRepository.save(stock);
            }
        }
        System.out.println("Blood stock initialized.");
    }
}
