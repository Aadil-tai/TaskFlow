# TaskFlow API - Backend

This is the backend API for **TaskFlow**, a real-time Kanban task management system. Built with Node.js, Express, and Prisma ORM.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (HttpOnly Cookies, Cross-Site Supported)
- **Documentation:** Swagger (OpenAPI)

## Prerequisites
- Node.js (v18+)
- PostgreSQL database

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables (.env provided):**
   The `.env` file is already included in this submission for your convenience. It is pre-configured to connect to the provided local database.

   *(If needed, the expected variables are: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`)*

3. **Database Setup:**
   Run Prisma migrations to generate tables:
   ```bash
   npx prisma migrate dev
   ```

4. **Seed Database:**
   To create the default Admin account (`admin@taskflow.dev` / `Admin@12345`):
   ```bash
   npm run seed:admin
   ```

5. **Start Server:**
   ```bash
   npm run dev
   ```

## API Documentation
Once the server is running, you can access the interactive Swagger API documentation at:
- **Local:** `http://localhost:5000/api/docs`
- **Production:** `https://<your-production-url>/api/docs`

## Scripts
- `npm run dev` - Starts development server with hot-reload
- `npm run start` - Starts production server
- `npm run seed:admin` - Seeds the database with the initial Admin user