# 🏙️ CivicEye AI - Geo-AI Civic Issue Classifier & Ward Routing System

**CivicEye AI** is an intelligent civic infrastructure management platform built with **React, Tailwind CSS, Leaflet OpenStreetMap, Spring Boot 3 (Java 17), and MySQL/H2**.

Citizens report civic defects (potholes, illegal constructions, waterlogging, garbage dumps, fallen trees), and the AI Computer Vision engine analyzes the imagery for depth, structural violations, and hazard urgency, automatically routing each issue to the respective municipal ward office via Haversine GIS geo-boundaries.

---

## 🚀 Key Features

1. **AI Computer Vision & Urgency Engine:**
   - Detects severity levels (**CRITICAL, HIGH, MEDIUM, LOW**)
   - Identifies specific civic hazards (e.g. *Fatal Two-Wheeler Skid Risk*, *Drainage Encroachment*, *Flash Flood Risk*)
   - Suggests SLA resolution timeframes (e.g. *4h Emergency, 24h, 48h*)

2. **Automated GIS Ward Routing:**
   - Real-time **Haversine Distance** calculations mapping GPS coordinates to municipal ward polygons
   - Auto-assigns ward number, jurisdictional zone, officer email, and emergency contact phone number

3. **Interactive OpenStreetMap + Leaflet:**
   - Real-time map pins with urgency pulse rings
   - Ward administrative boundaries and municipal zones
   - Interactive popups with photos, upvoting, and citizen reports

4. **Civic Officer Resolution Workflow:**
   - Ward officers can transition statuses (*Reported ➔ Assigned ➔ In Progress ➔ Resolved*)
   - Upload and verify post-repair resolution photo proof

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Leaflet, React-Leaflet, Lucide Icons, Canvas Confetti
- **Backend:** Spring Boot 3.2.5 (Java 17), Spring Data JPA, Hibernate, Jackson
- **Database:** MySQL 8.0 support & embedded H2 DB for zero-config startup
- **Geo-Intelligence:** GIS Haversine Boundary Polygon Matcher

---

## ⚡ Quick Start

### 1. Launch Both Frontend & Backend with 1 Click
Double-click `start-all.bat` or run:
```cmd
start-all.bat
```

### 2. Manual Run:
**Backend (Spring Boot):**
```powershell
cd server
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
*Backend runs on: `http://localhost:8080`*

**Frontend (React):**
```powershell
cd client
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 📡 API Endpoints

- `GET /api/issues` - List all reported civic issues (supports `?urgency=`, `?ward=`, `?category=`, `?status=`)
- `POST /api/issues` - Report a new defect with AI urgency extraction & ward auto-dispatch
- `PATCH /api/issues/{id}/status` - Update issue progress & attach resolution photo
- `POST /api/issues/{id}/upvote` - Citizen upvote priority increment
- `POST /api/ai/analyze` - AI Computer Vision diagnostic scan
- `GET /api/wards` - List all municipal wards & GIS coordinates
- `GET /api/stats` - Civic health metrics & urgency breakdowns
