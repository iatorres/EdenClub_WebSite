# EdenClub — Setup Guide

## Prerequisites

| Tool        | Version   | Install                          |
|-------------|-----------|----------------------------------|
| Node.js     | 18+       | https://nodejs.org               |
| Java JDK    | 17+       | https://adoptium.net             |
| Maven       | 3.9+      | https://maven.apache.org         |
| PostgreSQL  | 15+       | https://postgresql.org           |
| Git         | any       | https://git-scm.com              |

---

## 1. Database Setup

```sql
-- Run in psql or pgAdmin
CREATE DATABASE edenclub;
CREATE USER edenclub_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE edenclub TO edenclub_user;
```

Update `backend/src/main/resources/application.properties`:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/edenclub
spring.datasource.username=edenclub_user
spring.datasource.password=yourpassword
```

---

## 2. Backend Setup (Spring Boot)

```bash
cd backend

# Build & run
./mvnw spring-boot:run

# Or build jar first
./mvnw clean package -DskipTests
java -jar target/edenclub-api-1.0.0.jar
```

API will start at: **http://localhost:8080**

On first run, the `DataLoader` seeds:
- Admin user: `admin@edenclub.com` / `edenclub2025`
- 4 sample products

---

## 3. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

App will start at: **http://localhost:3000**

Create `.env` file in `/frontend`:
```
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=EdenClub
```

---

## 4. Admin Access

1. Go to `http://localhost:3000/login`
2. Email: `admin@edenclub.com`
3. Password: `edenclub2025`
4. You'll be redirected to `/admin`

Or navigate directly to `/admin` — you'll be redirected to login if not authenticated.

---

## 5. Project Structure

```
edenclub/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer, AdminLayout
│   │   │   └── ui/             # ProductCard, Cursor
│   │   ├── hooks/              # useApi.js (React Query hooks)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── services/           # Axios API client + endpoints
│   │   ├── store/              # Zustand (auth + cart)
│   │   └── styles/             # Tailwind globals
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/                     # Spring Boot API
    └── src/main/java/com/edenclub/
        ├── controller/          # REST controllers
        ├── service/             # Business logic
        ├── repository/          # JPA repositories
        ├── model/               # JPA entities
        ├── dto/                 # Data Transfer Objects
        ├── security/            # JWT filter + service
        ├── config/              # Security config
        └── exception/           # Global error handler
```

---

## 6. Key API Endpoints

### Auth
```
POST /api/auth/register     { firstName, lastName, email, password }
POST /api/auth/login        { email, password }
POST /api/auth/refresh      { refreshToken }
```

### Products (public)
```
GET  /api/products          ?page=0&size=12&category=Hoodies&search=hoodie
GET  /api/products/featured
GET  /api/products/:id
```

### Products (admin only)
```
POST   /api/products        Create product
PUT    /api/products/:id    Update product
DELETE /api/products/:id    Delete product
PATCH  /api/products/:id/stock  { stock: 10 }
```

### Admin
```
GET /api/admin/dashboard    Stats + recent orders
```

---

## 7. Adding Pages Not Yet Built

Pages still needed (stubs to create):

| Page          | Path               | Priority |
|---------------|--------------------|----------|
| Shop          | `/shop`            | High     |
| Cart          | `/cart`            | High     |
| Checkout      | `/checkout`        | High     |
| Profile       | `/profile`         | Medium   |
| Lookbook      | `/lookbook`        | Low      |
| About         | `/about`           | Low      |

Each page follows the same pattern:
1. Create file in `src/pages/`
2. Add route in `App.jsx`
3. Use hooks from `useApi.js` for data

---

## 8. Production Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Upload /dist folder or connect git repo
```

Set environment variable:
```
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend (Railway / Render / VPS)
```bash
cd backend
./mvnw clean package -DskipTests
# Deploy JAR or use Docker
```

### Docker (optional)
```dockerfile
# Backend Dockerfile
FROM eclipse-temurin:17-jre
COPY target/edenclub-api-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

---

## 9. Security Notes

- Change JWT secret before production
- Use HTTPS in production
- Set strong PostgreSQL passwords
- Remove seed DataLoader after first run
- Configure proper CORS origins

---

## 10. Tech Stack Reference

```
Frontend                     Backend
────────────────────         ────────────────────────
React 18                     Spring Boot 3.2
React Router 6               Spring Security 6
@tanstack/react-query        JWT (jjwt 0.12)
Zustand (state)              Spring Data JPA
react-hook-form + zod        Hibernate
Axios                        PostgreSQL
TailwindCSS 3                Maven
Vite 5                       Java 17
Lucide React (icons)
react-hot-toast
```
