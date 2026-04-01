# Task Management System

## Stack
- Backend: NestJS + TypeORM + SQLite (port 3001)
- Frontend: Next.js + Tailwind CSS (port 3000)

## Commands
- Backend: `cd backend && npm run start:dev`
- Frontend: `cd frontend && npm run dev`
- Tests: `cd backend && npm test`
- Docker: `docker-compose up --build`

## Architecture
- Task entity with self-referencing parent_id for subtask hierarchy
- Effort aggregation is a pure recursive function for testability
- API returns root tasks only on list, full tree on detail
- Frontend uses App Router with server components for data fetching
