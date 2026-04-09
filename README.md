# Chat App

A full-stack real-time chat application built with a Node.js/Express backend and a React frontend. Users can register, log in, send messages (text + images), and see who's online — all updating live via WebSockets.

---

## Tech Stack

**Backend**

- Node.js + Express 5 (TypeScript)
- MongoDB + Mongoose
- Socket.IO — real-time messaging and online presence
- JWT stored in HTTP-only cookies (auth)
- Cloudinary — profile picture and image message storage
- Multer — file upload handling
- Joi — request validation
- Winston — file-based request logging
- express-rate-limit — API rate limiting (100 req/hr per IP)
- Docker (dockerfile included) `TODO`

**Frontend**

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + DaisyUI
- Zustand — global auth state
- React Query (TanStack) — server state / data fetching
- React Router v7
- Socket.IO client
- Axios — pre-configured HTTP instance

---

## Features

- **Auth** — register, log in, log out via JWT cookie sessions
- **Profile** — update display name and profile picture (auto-resized via Cloudinary)
- **Real-time messaging** — text and image messages delivered instantly over WebSockets
- **Online presence** — live indicator showing which users are currently connected
- **Chat history** — conversations sorted by most recent message
- **Protected routes** — auth guard prevents unauthenticated access, no flash of content
- **Error handling** — centralised global error middleware on the backend; toast notifications on the frontend

---

## Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/       # auth, messages, contacts
│       ├── middlewares/       # auth guard, error handler, socket auth, validation
│       ├── models/            # User, Message (Mongoose schemas)
│       ├── routes/            # auth + message route definitions
│       ├── lib/               # DB connection, socket setup, Cloudinary, env, utils
│       └── validators/        # Joi schemas for request bodies
│
└── frontend/
    └── src/
        ├── components/        # Auth forms, chat UI, layout shells
        ├── pages/             # LoginPage, SignupPage, ChatPage
        ├── store/             # Zustand auth store
        └── lib/               # Axios instance, API error handler
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint                           | Description                     |
| ------ | ---------------------------------- | ------------------------------- |
| POST   | `/api/auth/register`               | Create account                  |
| POST   | `/api/auth/login`                  | Log in                          |
| POST   | `/api/auth/logout`                 | Log out                         |
| PATCH  | `/api/auth/update-profile`         | Update display name             |
| PATCH  | `/api/auth/update-profile-picture` | Upload new avatar               |
| GET    | `/api/messages/contacts`           | All users (contact list)        |
| GET    | `/api/messages/chat-partners`      | Conversations with last message |
| GET    | `/api/messages/:id`                | Message history with a user     |
| POST   | `/api/messages/send/:id`           | Send a message (text or image)  |

## API Documentation

A complete Postman collection is available in [`Postman API Collection`](/backend/docs/postman-api-collection.json) for testing all endpoints.

## TODO

- Dockerize the app (backend + frontend)
- Add Test cases (Jest + React Testing Library)
- Feature:
  - Sending verifying emails on registration, password reset flow
  - Read receipts
  - Group chats
  - Real-time typing indicators, unread message counts, and chat list updates
  - Optimistic message sending on the frontend for instant UI feedback
  - User search for starting new conversations

---

## Author

**Amr Elkfrawy** — [github.com/AmrElkfrawy](https://github.com/AmrElkfrawy)
