# Village Trails Resort CRM Platform

A full-stack, production-ready Resort Management CRM built with **Next.js 15**, **Spring Boot 3.2**, and **PostgreSQL 16**.

---

## Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | Next.js 15 · TypeScript · Tailwind CSS · Zustand · Framer Motion · Radix UI |
| Backend    | Spring Boot 3.2 · Java 21 · Spring Security · JWT · WebSocket (STOMP) |
| Database   | PostgreSQL 16                                           |
| Container  | Docker · Docker Compose · Nginx                        |

---

## Project Structure

```
CRM-testout1/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/# UI + dashboard components
│   │   ├── data/      # Mock data (dev)
│   │   ├── lib/       # Utilities, API client
│   │   ├── store/     # Zustand auth store
│   │   └── types/     # Shared TypeScript types
│   └── Dockerfile
├── backend/           # Spring Boot API
│   ├── src/main/java/com/villagetrails/crm/
│   │   ├── config/    # Security, WebSocket config
│   │   ├── controller/# REST controllers
│   │   ├── dto/       # Request/Response records
│   │   ├── entity/    # JPA entities + enums
│   │   ├── exception/ # Global error handler
│   │   ├── repository/# Spring Data JPA repos
│   │   ├── security/  # JWT + UserDetails
│   │   └── service/   # Business logic
│   └── Dockerfile
├── database/
│   ├── schema.sql     # Full PostgreSQL DDL
│   └── seed.sql       # Dev seed data
├── nginx/
│   └── nginx.conf     # Reverse proxy config
├── docker-compose.yml
└── .env.example
```

---

## Quick Start (Docker)

```bash
# 1. Clone and enter the project
git clone <repo-url>
cd CRM-testout1

# 2. Set up environment variables
cp .env.example .env
# Edit .env and set a strong JWT_SECRET

# 3. Start all services
docker compose up -d

# 4. Access the app
#    Frontend:  http://localhost
#    API:       http://localhost/api
#    DB:        localhost:5432
```

---

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Backend
```bash
# Start PostgreSQL first (or use Docker):
docker compose up postgres -d

cd backend
./mvnw spring-boot:run
# API available at http://localhost:8080/api
```

---

## Default Login Credentials

| Role         | Email                          | Password     |
|--------------|-------------------------------|--------------|
| Super Admin  | admin@villagetrails.in        | password123  |
| Manager      | manager@villagetrails.in      | password123  |
| Reception    | reception@villagetrails.in    | password123  |
| Kitchen Head | kitchen@villagetrails.in      | password123  |
| Accountant   | accounts@villagetrails.in     | password123  |
| Housekeeping | housekeeping@villagetrails.in | password123  |

---

## API Endpoints

| Method | Path                       | Description              | Roles                     |
|--------|----------------------------|--------------------------|---------------------------|
| POST   | /api/auth/login            | Authenticate             | Public                    |
| POST   | /api/auth/refresh          | Refresh token            | Public                    |
| GET    | /api/dashboard/stats       | Live KPI stats           | All                       |
| GET    | /api/rooms                 | List rooms               | All                       |
| PATCH  | /api/rooms/:id/status      | Update room status       | Manager, Housekeeping     |
| GET    | /api/bookings              | Paginated bookings       | Manager, Reception        |
| POST   | /api/bookings/:id/check-in | Check-in guest           | Reception                 |
| GET    | /api/orders                | Active kitchen orders    | Kitchen Head              |
| PATCH  | /api/orders/:id/status     | Advance order status     | Kitchen Head              |
| GET    | /api/guests                | Paginated guests         | Manager, Reception        |
| GET    | /api/staff                 | Staff list               | Manager                   |
| GET    | /api/invoices              | Invoices list            | Accountant                |

---

## WebSocket

Connect via STOMP at `ws://localhost:8080/api/ws`

| Topic            | Description                         |
|------------------|-------------------------------------|
| `/topic/kitchen` | Real-time food order status updates |

---

## Role-Based Access

| Feature         | Super Admin | Manager | Reception | Kitchen Head | Accountant | Housekeeping |
|-----------------|:-----------:|:-------:|:---------:|:------------:|:----------:|:------------:|
| Dashboard       | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rooms           | ✅ | ✅ | 👁 | — | — | ✅ |
| Bookings        | ✅ | ✅ | ✅ | — | — | — |
| Kitchen/Orders  | ✅ | ✅ | — | ✅ | — | — |
| Guests          | ✅ | ✅ | ✅ | — | — | — |
| Accounting      | ✅ | ✅ | — | — | ✅ | — |
| Staff           | ✅ | ✅ | — | — | — | — |
| Settings        | ✅ | ✅ | — | — | — | — |
