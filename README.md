# TaskFlow

A task management web application for small development teams.

## Stack

- **Backend:** NestJS + TypeORM + SQLite
- **Frontend:** Next.js + Tailwind CSS

## Features

- Create, view, update and delete tasks
- Task hierarchy with unlimited subtask nesting
- Status lifecycle: Not Started → In Progress → Done
- Priority levels: Low, Medium, High
- Effort estimation with aggregated calculations across subtask trees
- Filter, search and sort tasks
- Pagination

## Running locally

### Requirements
- Node.js 20+
- npm

### Backend

    cd backend
    npm install
    npm run start:dev

API will be available at http://localhost:3001

### Frontend

    cd frontend
    npm install
    npm run dev

App will be available at http://localhost:3000

### Running tests

    cd backend
    npm test

## Running with Docker

### Requirements
- Docker Desktop installed and running (https://www.docker.com/products/docker-desktop)

    docker-compose up --build

App will be available at http://localhost:3000
