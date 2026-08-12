package com.fixmate.service;

import com.fixmate.dto.NotificationResponse;
import com.fixmate.entity.Notification;
import com.fixmate.entity.User;
import com.fixmate.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void notify(User user, String title, String message) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .build();
        notificationRepository.save(n);
    }

    public List<NotificationResponse> getForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(NotificationResponse::from).toList();
    }

    public void markAsRead(Long id, User user) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        if (n.getUser().getId().equals(user.getId())) {
            n.setRead(true);
            notificationRepository.save(n);
        }
    }
}
