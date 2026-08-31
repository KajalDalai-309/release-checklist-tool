# 🚀 Release Checklist Tool -> Demo Link(https://release-checklist-tool-s3s0.onrender.com/)

A functional, modern full-stack Single Page Application (SPA) designed to streamline software release operations. It enables development teams to orchestrate releases, track standard workflow checklist steps in real time, and automatically compute release readiness status.

---

## 📌 1. Assignment Overview & Requirements Covered

### Core Entity: `Release`
- **`name`** (String, mandatory): Identifier for the release (e.g. `Release 2026.09 - Auth v2`).
- **`targetDate`** (DateTime, mandatory): Scheduled release date & time.
- **`status`** (Auto-computed: `planned` | `ongoing` | `done`):
  - 🟡 `planned`: 0 steps completed
  - 🟠 `ongoing`: At least 1 step completed, but not all
  - 🟢 `done`: All steps completed
- **`additionalInfo`** (String, optional): Release notes, rollback strategy, environment notes.
- **`completedSteps`**: Persisted state of completed steps.

### Standard Release Steps (Consistent 8-step workflow)
1. **Code freeze & merge to release branch**
2. **Run automated test suite**
3. **Build production artifacts & container images**
4. **Deploy to Staging environment**
5. **Execute QA smoke & regression testing**
6. **Apply database migrations & backup snapshots**
7. **Deploy to Production environment**
8. **Post-release health check & publish release notes**

---

## ✨ 2. Key Features

- ✅ **Single-Page Application (SPA)**: Ultra-fast and interactive React + Vite frontend.
- ✅ **Real-time Step Checklist**: Check and uncheck steps with instant status recalculation and animated progress bar.
- ✅ **Release Creation & Editing**: Create new releases and update release details / additional info.
- ✅ **Deletion Support (Nice-to-have)**: Delete releases with confirmation dialog.
- ✅ **Responsive & Polished UI (Nice-to-have)**: Glassmorphism theme, accessible status badges, and mobile responsiveness.
- ✅ **Dual API Layer (Nice-to-have)**: Full REST API + GraphQL Apollo Server endpoint.
- ✅ **Automated Tests (Nice-to-have)**: Jest & Supertest test suite for controllers, status calculation logic, and validation.
- ✅ **Docker Ready (Nice-to-have)**: `Dockerfile` and `docker-compose.yaml` for one-command execution.

---

## 🗄️ 3. Database Schema

The database model is defined with **Prisma ORM** (`prisma/schema.prisma`):

```prisma
datasource db {
  provider = "sqlite" // Or "postgresql" / "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Release {
  id              String   @id @default(uuid())
  name            String
  targetDate      DateTime
  additionalInfo  String?  @default("")
  completedSteps  String   @default("[]") // Stored JSON array of completed step IDs: ["step-1", "step-2"]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 🔌 4. API Endpoints Specification

### REST API

| Method | Endpoint | Description | Request Body Example |
|---|---|---|---|
| `GET` | `/api/releases` | List all releases with computed status & steps | None |
| `POST` | `/api/releases` | Create a new release | `{"name": "v2.0", "targetDate": "2026-09-01T12:00:00Z", "additionalInfo": "Notes"}` |
| `GET` | `/api/releases/:id` | Get details of a single release | None |
| `PATCH` | `/api/releases/:id` | Update release name, date, or additional info | `{"additionalInfo": "Updated release notes"}` |
| `POST` | `/api/releases/:id/toggle-step` | Toggle a single step on or off | `{"stepId": "step-1", "completed": true}` |
| `PATCH` | `/api/releases/:id/steps` | Bulk update completed steps array | `{"completedStepIds": ["step-1", "step-2"]}` |
| `DELETE` | `/api/releases/:id` | Delete a release | None |
| `GET` | `/api/steps` | List standard 8 release checklist steps | None |

### GraphQL API (`/graphql`)

#### Query All Releases:
```graphql
query {
  releases {
    id
    name
    targetDate
    status
    progressPercentage
    completedCount
    totalSteps
    additionalInfo
    steps {
      id
      title
      completed
    }
  }
}
```

#### Mutation - Toggle Step:
```graphql
mutation {
  toggleStep(id: "RELEASE_ID", stepId: "step-1", completed: true) {
    id
    status
    completedCount
    progressPercentage
  }
}
```

---

## 🛠️ 5. Local Setup & Execution Guide

### Prerequisites
- **Node.js**: v18+ 
- **npm**: v9+

### Option A: Running with npm (Recommended)

1. **Install dependencies for Backend & Frontend**:
   ```bash
   cd release-checklist-tool
   npm run install:all
   ```

2. **Initialize Database & Seed Sample Releases**:
   ```bash
   npm run db:setup
   ```

3. **Start Backend Server** (in one terminal):
   ```bash
   npm run dev:backend
   ```
   *Runs at `http://localhost:5000` (REST) and `http://localhost:5000/graphql` (GraphQL).*

4. **Start Frontend Dev Server** (in another terminal):
   ```bash
   npm run dev:frontend
   ```
   *Opens at `http://localhost:3000`.*

---

### Option B: Running with Docker Compose

To launch PostgreSQL, Backend, and Frontend in isolated containers:
```bash
cd release-checklist-tool
docker-compose up --build
```
- Access UI: `http://localhost:3000`
- Access Backend API: `http://localhost:5000`

---

## 🧪 6. Running Automated Tests

Run the test suite verifying step calculation, CRUD, and validations:
```bash
cd release-checklist-tool/backend
npm test
```

---

## ☁️ 7. Online Deployment Guide

### Database (PostgreSQL)
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app).
2. Copy the connection string to `DATABASE_URL`.
3. In `backend/prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.

### Backend Deployment (Render / Railway)
1. Push repository to GitHub.
2. Link repo to **Render** or **Railway** (Root directory: `backend`).
3. Set environment variable `DATABASE_URL`.
4. Build command: `npm install && npx prisma generate && npx prisma db push && node prisma/seed.js`
5. Start command: `node src/server.js`

### Frontend Deployment (Vercel / Netlify)
1. Link repo to **Vercel** (Root directory: `frontend`).
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-service.onrender.com/api`
