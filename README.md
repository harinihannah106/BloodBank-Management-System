<<<<<<< HEAD
# 🩸 BloodBank Management System — Setup Guide

## Tech Stack
- **Frontend:** React 18 + Vite + React Router + Recharts
- **Backend:** Spring Boot 3 + Spring Security + JWT
- **Database:** MySQL 8

---

## Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8 running on localhost:3306

---

## 📁 Project Structure
```
bloodbank/
├── backend/          ← Spring Boot app
│   ├── pom.xml
│   └── src/main/java/com/bloodbank/
│       ├── entity/       ← JPA entities
│       ├── repository/   ← Spring Data repos
│       ├── service/      ← Business logic
│       ├── controller/   ← REST controllers
│       ├── security/     ← JWT + Spring Security
│       ├── config/       ← Security config + DataInitializer
│       └── dto/          ← Data Transfer Objects
└── frontend/         ← React app
    ├── package.json
    └── src/
        ├── pages/
        │   ├── auth/       ← Login, Register
        │   ├── donor/      ← Donor Dashboard, Profile, etc.
        │   ├── recipient/  ← Recipient Dashboard, Requests, etc.
        │   └── admin/      ← Admin Dashboard, Analytics, etc.
        ├── components/     ← Sidebar, Layout, ProtectedRoute
        ├── services/       ← Axios API calls
        └── context/        ← Auth Context
```

---

## 🚀 Steps to Run

### Step 1 — MySQL Setup
```bash
# Login to MySQL
mysql -u root -p09122005

# Create the database (auto-created by Spring Boot, but you can also run:)
CREATE DATABASE bloodbank_db;
EXIT;
```

### Step 2 — Start Backend
```bash
cd bloodbank/backend
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend runs at: **http://localhost:8080**

On first startup, it auto-creates:
- All database tables
- Admin user: `admin@bloodbank.com` / `admin123`
- Blood stock for all 8 blood groups

### Step 3 — Start Frontend
```bash
cd bloodbank/frontend
npm install
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 🔐 Default Login Credentials

| Role      | Email                   | Password   |
|-----------|-------------------------|------------|
| **Admin** | admin@bloodbank.com     | admin123   |
| Donor     | Register a new account  | —          |
| Recipient | Register a new account  | —          |

---

## 🎯 Features by Role

### 🩸 Donor
- Complete donor profile (blood group, age, weight, location)
- Toggle availability status
- Accept/decline blood donation requests
- View donation history
- Receive real-time notifications

### 🏥 Recipient
- Create blood requests with urgency levels
- Track request status (Pending → Approved → Donor Assigned → Completed)
- Smart donor suggestions filtered by blood group
- View all personal requests

### 👨‍💼 Admin
- Real-time dashboard with 5 key metric cards
- Blood Group stock bar charts
- Monthly trend line chart
- Emergency vs Normal pie chart
- Manage and block/unblock donors
- Approve/reject blood requests
- Edit blood stock inventory

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`

### Donor
- `GET/POST /api/donor/profile`
- `PUT /api/donor/availability`
- `GET /api/donor/history`
- `GET /api/donor/notifications`
- `PUT /api/donor/notifications/{id}/respond`

### Recipient
- `POST /api/recipient/request`
- `GET /api/recipient/requests`
- `GET /api/recipient/donors/suggest?bloodGroup=O-`

### Admin
- `GET /api/admin/stats`
- `GET /api/admin/donors`
- `PUT /api/admin/users/{id}/block`
- `GET /api/admin/requests`
- `PUT /api/admin/requests/{id}/approve`
- `GET /api/admin/stock`
- `PUT /api/admin/stock/{bloodGroup}`

---

## ⚙️ Configuration
Edit `backend/src/main/resources/application.properties` to change:
- MySQL host/port/credentials
- JWT secret key
- Server port

---

## 🛠 Troubleshooting

**MySQL Connection Error:**
```
Check that MySQL is running and credentials match:
username: root, password: 09122005
```

**Port already in use:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
# Or change server.port in application.properties
```

**CORS errors:**
The backend allows `http://localhost:5173` and `http://localhost:3000`. If using a different port, update `SecurityConfig.java`.
=======
# BloodBank-Management-System
Full-stack role-based web application using React and Spring Boot to manage blood donations and requests.
>>>>>>> c323d2d952a38f2160289b05e9a01db8e74f9236
