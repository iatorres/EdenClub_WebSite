# EdenClub — Full Stack Architecture Guide

## Stack Overview

```
Frontend          Backend           Database
─────────         ─────────         ─────────
React 18          Spring Boot 3     PostgreSQL 15
React Router 6    Spring Security   (MySQL optional)
Axios             JWT Auth
TailwindCSS       Hibernate / JPA
Zustand           Maven
Vite
```

## System Architecture

```
Browser (React SPA)
       │
       │  HTTPS / REST JSON
       ▼
  ┌─────────────────────────┐
  │    Spring Boot API      │
  │  ┌─────────────────┐   │
  │  │  Security Layer  │   │  JWT validation
  │  │  (Spring Sec)    │   │  CORS / CSRF
  │  └────────┬────────┘   │
  │           │             │
  │  ┌────────▼────────┐   │
  │  │   Controllers    │   │  REST endpoints
  │  └────────┬────────┘   │
  │           │             │
  │  ┌────────▼────────┐   │
  │  │    Services      │   │  Business logic
  │  └────────┬────────┘   │
  │           │             │
  │  ┌────────▼────────┐   │
  │  │  Repositories    │   │  JPA / Hibernate
  │  └────────┬────────┘   │
  └───────────┼─────────────┘
              │
       ┌──────▼──────┐
       │ PostgreSQL   │
       └─────────────┘
```

## Domain Model

```
users ──────────── orders ──────── order_items
  │                                      │
  └──── cart ──── cart_items             │
                       │                 │
                    products ────────────┘
                       │
                  categories
```

## Authentication Flow

```
1. POST /api/auth/login  { email, password }
2. Backend validates → generates JWT (15min access + 7d refresh)
3. Frontend stores tokens in httpOnly cookie (access) + localStorage (refresh)
4. Each request: Authorization: Bearer <token>
5. Token expired → auto-refresh via interceptor
6. Logout → DELETE /api/auth/logout → invalidate refresh token
```

## API Structure

```
/api
  /auth
    POST   /login
    POST   /register
    POST   /refresh
    DELETE /logout

  /products
    GET    /              (public, paginated)
    GET    /:id            (public)
    GET    /featured       (public)
    POST   /               (ADMIN)
    PUT    /:id             (ADMIN)
    DELETE /:id             (ADMIN)
    PATCH  /:id/stock       (ADMIN)

  /categories
    GET    /               (public)

  /cart
    GET    /               (USER)
    POST   /items           (USER)
    PUT    /items/:id       (USER)
    DELETE /items/:id       (USER)
    DELETE /               (USER - clear)

  /orders
    GET    /               (USER - own orders)
    GET    /:id             (USER - own order)
    POST   /               (USER)
    GET    /admin/all       (ADMIN)
    PUT    /admin/:id/status (ADMIN)

  /users
    GET    /me              (USER)
    PUT    /me              (USER)
    PUT    /me/password     (USER)
    GET    /admin/all       (ADMIN)
    DELETE /admin/:id       (ADMIN)

  /admin
    GET    /dashboard       (ADMIN - stats)
```

## Environment Variables

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=EdenClub
```

**Backend (application.properties)**
```
spring.datasource.url=jdbc:postgresql://localhost:5432/edenclub
spring.datasource.username=postgres
spring.datasource.password=yourpassword
jwt.secret=your-256-bit-secret-key
jwt.expiration=900000
jwt.refresh-expiration=604800000
```
