# FitTrack – Personal Fitness Tracker App

FitTrack is a full-stack fitness tracking application designed to help individuals build, manage, and track their personalized workout programs with precision and flexibility.

## 🧠 Core Idea

FitTrack empowers users to define their own exercises, build custom multi-day workout programs, and log real-world workouts over time. It emphasizes flexibility and personal progress tracking with a system that allows continuous editing of programs while preserving workout history.

---

## ⚙️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript**
- **PostgreSQL** via Prisma
- **JWT-based Authentication**
- RESTful API

### Frontend
- **React Native** (mobile-focused)
- **TypeScript**
- **TailwindCSS** via `nativewind`

---

## 🔐 Features

### 🏋️‍♂️ Exercise Table
- Users define their own exercises.
- Each exercise includes:
  - Name
  - Set-based data (each set has weight and reps)
  - Weight stored in kg or lbs (user preference)
- Only the latest state is stored (not historical).

### 📋 Custom Workout Programs
- Users can create personalized programs consisting of multiple workout days.
- Each day includes exercises selected from the user's personal table.
- Editable at any time.
- Each program has:
  - Name
  - Status (`active` / `inactive`)
  - Optional details

### 📝 Program Logs
- Users log completed workout days manually (not daily-bound).
- Each log entry includes:
  - Date
  - Per-exercise sets (weight + reps)
- Logs are permanently linked to the program’s name and structure at the time of logging.
- Inactive/ended programs are retained for history.

---

## 🚀 MVP Roadmap

- [x] User authentication (JWT)
- [x] Create and manage personal exercise table
- [x] Program creation with custom days and exercise assignment
- [ ] Workout logging per program day
- [ ] Exercise table updates based on latest log entry
- [ ] View current active program + log history
- [ ] Tailwind-styled mobile UI with React Native

---

## 📦 Installation

This project is structured as a monorepo:
- `server/` → Express.js API with TypeScript
- `mobile/` → React Native app with Tailwind support (Coming Soon)

### Prerequisites
- Node.js (v18 or higher)
- Docker (for PostgreSQL)
- Git

### Server Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FitTrack/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/fittrack"
   JWT_SECRET="your-super-secret-jwt-key"
   NODE_ENV="development"
   PORT=4000
   ```

4. **Start PostgreSQL with Docker**
   ```bash
   docker run --name fittrack-postgres \
     -e POSTGRES_USER=username \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=fittrack \
     -p 5432:5432 \
     -d postgres
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Optional: Open Prisma Studio** (Database GUI)
   ```bash
   npx prisma studio
   ```

### API Endpoints

Once the server is running on `http://localhost:4000`, you can test the authentication endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/logout` - User logout

> Mobile app setup instructions will be added when the React Native implementation is ready.

---
