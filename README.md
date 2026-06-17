# Twitter Clone

A full-stack Twitter-like application built with Next.js 16, React 19, MongoDB, Redis, and Socket.io.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) + React 19 |
| Language | TypeScript 5 |
| Database | MongoDB via Mongoose 9 |
| Cache / Pub-Sub | Redis via ioredis 5 |
| Real-time | Socket.io 4 (standalone Node.js process) |
| Auth | JWT in HTTP-only cookie + bcryptjs |
| Validation | Zod v4 (shared between client and server) |
| State | Zustand 5 |
| Styling | Tailwind CSS 4 |
| Email | Nodemailer |

## Features

**Auth**
- Registration with email verification
- Login / Logout (JWT in HTTP-only cookie)
- Password reset via email link
- Change password via token

**Tweets**
- Create tweet (title, body, tags)
- Paginated feed (all tweets / my tweets)
- Single tweet page with comments
- Like / Dislike with mutual exclusion (optimistic UI updates)
- View counter
- Tag system

**Comments**
- Add comment to a tweet
- After creation — real-time notification to the post author via Socket.io

**Real-time notifications**
- Socket.io connection authenticated with the same JWT cookie
- Each user has a private room (`socket.join(userId)`)
- Flow: Next.js API → Redis `NEW_COMMENT` pub/sub → Socket server → `emit("notification")` to author
- Toast-style notifications with auto-dismiss (Zustand store)

## Architecture Highlights

- **Layered pattern**: `Controller → Service → Model` for each domain (auth, post, comment, user)
- **Separate Socket.io process**: standalone long-lived Node.js server on port 4000 with its own `Dockerfile.socket`
- **Redis as event bus**: HTTP layer (Next.js) publishes, WebSocket layer (Socket server) subscribes
- **Universal `<Form>` component**: declarative field definitions + Zod schema → client-side validation before submit, server-side errors surfaced back into the same fields
- **`ApiService` singleton**: typed fetch wrapper with `get()`, `post()`, `patch()`, throws `ApiHttpError` on non-2xx
- **`BaseController`**: abstract class with `validate()` (Zod safeParse) and `formResponse()` (standardized response tuple)
- **React Compiler** enabled — automatic memoization

## Local Development

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) and Docker Compose

### Option A — Docker Compose (recommended)

Starts MongoDB, Redis, Socket server, and Next.js in watch mode with DB seed:

```bash
# 1. Copy environment file
cp .env.example .env.development   # or create manually (see Environment Variables below)

# 2. Start everything
docker compose up
```

App will be available at [http://localhost:3000](http://localhost:3000).

The `nextjs` service automatically runs `npm run seed` on startup to populate the DB with example data.

To rebuild after dependency changes:

```bash
docker compose up --build
```

### Option B — Local Node.js + Docker services

Run infrastructure in Docker, Next.js and Socket server locally (faster hot-reload):

```bash
# 1. Install dependencies
npm ci

# 2. Copy environment file
cp .env.example .env.development

# 3. Start Redis only
npm run dev:redis
# equivalent to: docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d redis

# 4. Seed the database (first time only)
npm run seed

# 5. Start Socket.io server (separate terminal)
npm run dev:socket

# 6. Start Next.js dev server (separate terminal)
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)  
Socket server: [http://localhost:4000](http://localhost:4000)

### Environment Variables

Create `.env.development` in the project root:

```env
# MongoDB
MONGODB_URI=mongodb://root:password@localhost:27017/new-twitter-clone?authSource=admin

# Auth
JWT_SECRET=your-dev-jwt-secret

# URLs
NEXT_PUBLIC_EXTERNAL_URL=https://dummyjson.com
NEXT_PUBLIC_BASIC_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

# Email (for verification/reset — can use Mailtrap or similar for dev)
EMAIL_SERVER_HOST=smtp.mailtrap.io
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-mailtrap-user
EMAIL_SERVER_PASSWORD=your-mailtrap-password
```

> Email is required for registration (verification link). For local testing use [Mailtrap](https://mailtrap.io/) or any SMTP sandbox.

### Seed Data

```bash
npm run seed
```

Populates MongoDB with example users and tweets. Runs automatically in Docker Compose mode.

## Project Structure

```
app/
├── api/                    # API route handlers
│   ├── auth/               # login, logout, me, registration, reset-password, verify-email
│   ├── post/               # create, feed, react (like/dislike)
│   ├── comment/            # create comment
│   └── user/               # get/update profile
│
├── _feature/               # Business logic
│   ├── auth/               # AuthController, DTOs, Zod schemas
│   ├── post/               # PostController, PostService, Post model
│   ├── comment/            # CommentController, CommentService, Comment model
│   └── user/               # UserController, UserService, User model
│
├── _common/                # BaseController, BaseService, shared types
├── _utils/                 # ApiService, ApiHttpError, redis client, logger
├── components/             # Reusable UI: Form, Pagination, Notifications, Spinner, etc.
├── lib/                    # MongoDB connection, env helpers, Zustand stores
├── (main)/                 # Page routes (feed, tweets, login, profile, etc.)
└── _example/               # seed.ts

socket/
└── server.ts               # Socket.io server (port 4000)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run dev:redis` | Start Redis in Docker |
| `npm run dev:socket` | Start Socket.io server locally |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed MongoDB with example data |
| `npm run lint` | Run ESLint |
