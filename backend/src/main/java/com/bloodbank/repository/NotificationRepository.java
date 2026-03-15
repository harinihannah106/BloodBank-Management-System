package com.bloodbank.repository;

import com.bloodbank.entity.Notification;
import com.bloodbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndRead(User user, boolean read);
    long countByUserAndRead(User user, boolean read);
}
