# Civic Sync – Full-stack starter

## Requirements
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)

## 1. Backend setup
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and fill in `MONGO_URI` and a long `JWT_SECRET`.
Create the first admin account with:
```bash
npm run create-admin
```
The script reads `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `.env`.
Start backend:
```bash
npm run dev
```
Backend runs at http://localhost:5000.

## 2. Frontend setup
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally http://localhost:5173).

## 3. Important notes
- Register creates citizen accounts only. Admin accounts are created with `npm run create-admin`.
- Citizen routes and admin routes are protected by JWT authentication and role checks.
- Reports, users and notifications are stored in MongoDB.
- Uploaded images are stored in `server/uploads` for local development. For deployment, use cloud object storage.
- The location field accepts a user-entered address/landmark. This starter does not include a live map/geocoding API.
- This is a learning-project starter. Before public deployment, add rate limiting, email verification, password reset, stronger validation, HTTPS, cloud image storage and production logging.
