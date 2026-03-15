package com.bloodbank.dto;

import com.bloodbank.entity.User;

public class AuthDtos {

    public static class LoginRequest {
        private String email;
        private String password;
        public LoginRequest() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private User.Role role;
        public RegisterRequest() {}
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }

    public static class JwtResponse {
        private String token;
        private Long id;
        private String name;
        private String email;
        private String role;
        private boolean profileCompleted;
        public JwtResponse() {}
        public JwtResponse(String token, Long id, String name, String email, String role, boolean profileCompleted) {
            this.token = token; this.id = id; this.name = name;
            this.email = email; this.role = role; this.profileCompleted = profileCompleted;
        }
        public String getToken() { return token; }
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public boolean isProfileCompleted() { return profileCompleted; }
    }

    public static class MessageResponse {
        private String message;
        public MessageResponse() {}
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
