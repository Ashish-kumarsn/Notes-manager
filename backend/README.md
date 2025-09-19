# Notes Manager - Backend

## Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set your `MONGO_URI` and `JWT_SECRET`.
4. `npm run dev` (requires nodemon) or `npm start`

API routes:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/notes
- GET  /api/notes
- PUT  /api/notes/:id
- DELETE /api/notes/:id
