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

- [ ] User authentication (JWT)
- [ ] Create and manage personal exercise table
- [ ] Program creation with custom days and exercise assignment
- [ ] Workout logging per program day
- [ ] Exercise table updates based on latest log entry
- [ ] View current active program + log history
- [ ] Tailwind-styled mobile UI with React Native

---

## 📦 Installation (Coming Soon)

This project will be structured as a monorepo:
- `server/` → Express.js API with TypeScript
- `mobile/` → React Native app with Tailwind support

> Full setup instructions and scripts will be added in the initial release.

---
