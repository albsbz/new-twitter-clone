## Twitter Clone (new-twitter-clone)

### Technology Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **UI**: React 19.2.4, React DOM 19.2.4
- **Database**: MongoDB (via Mongoose 9.5.0)
- **Cache/Message Broker**: Redis (ioredis 5.11.1)
- **Real-time**: Socket.io 4.8.3 (server & client)
- **Authentication**: JWT (jsonwebtoken 9.0.3), bcryptjs 3.0.3
- **Email**: Nodemailer 8.0.7
- **Validation**: Zod 4.3.6
- **State Management**: Zustand 5.0.12
- **Icons**: @heroicons/react 2.2.0
- **Styling**: TailwindCSS 4
- **Language**: TypeScript 5

### Architecture

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── not-found.tsx           # 404 page
├── globals.css             # Global styles
│
├── api/                    # API Routes (HTTP endpoints)
│   ├── auth/
│   │   ├── login/          # POST /api/auth/login
│   │   ├── logout/         # POST /api/auth/logout
│   │   ├── me/             # GET /api/auth/me
│   │   ├── registration/   # POST /api/auth/registration
│   │   ├── reset-password/ # POST /api/auth/reset-password
│   │   ├── update-password/# POST /api/auth/update-password
│   │   └── verify-email/   # POST /api/auth/verify-email
│   ├── comment/
│   │   └── [postId]/       # POST /api/comment/[postId]
│   ├── post/
│   │   ├── [id]/           # GET/DELETE /api/post/[id]
│   │   └── feed/           # GET /api/post/feed
│   └── user/
│       └── [id]/           # GET /api/user/[id]
│
├── _feature/               # Business logic layer
│   ├── auth/
│   │   ├── auth.controller.ts  # Auth business logic
│   │   ├── types/              # DTOs, schemas
│   │   └── index.ts
│   ├── comment/
│   │   ├── comment.controller.ts
│   │   ├── comment.service.ts
│   │   ├── db/
│   │   │   └── comment.model.ts
│   │   ├── types/
│   │   └── index.ts
│   ├── post/
│   │   ├── post.controller.ts
│   │   ├── post.service.ts
│   │   ├── db/
│   │   │   └── post.model.ts
│   │   ├── types/
│   │   └── index.ts
│   └── user/
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── db/
│       │   └── user.model.ts
│       ├── types/
│       └── index.ts
│
├── _common/                # Shared utilities
│   ├── base.controller.ts  # Base controller class
│   └── ...
├── _utils/                 # Utility functions
│   └── logger.ts
├── _hooks/                 # Custom React hooks
├── lib/                    # Library configurations
│   ├── env.ts              # Environment variables
│   ├── mail.ts             # Email configuration
│   ├── mongodb.ts          # MongoDB connection
│   └── store/              # Zustand stores
├── components/             # React components
│
├── (main)/                 # Route groups
│   ├── login/
│   ├── register/
│   ├── feed/
│   └── ...
├── _example/               # Example data/seeds
│   └── seed.ts
│
socket/
└── server.ts               # Socket.io server (port 4000)
```

### Data Models

#### User Model

```typescript
{
  email: string
  password: string (hashed)
  name: string
  isVerified: boolean
  verificationEmailSendAt: Date | null
  createdAt: Date
  likedPosts: ObjectId[] (ref: Post)
  dislikedPosts: ObjectId[] (ref: Post)
  updatedAt: Date
}
```

#### Post Model

```typescript
{
  title: string
  body: string
  tags: [{ body: string, date: Date }]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
  author: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

#### Comment Model

```typescript
{
  body: string
  postId: ObjectId (ref: Post)
  authorId: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Authentication Flow

```
1. Registration → User created → Verification email sent
2. Email verification → User.isVerified = true
3. Login → JWT token generated → Stored in HTTP-only cookie
4. Protected routes → JWT verified → User ID extracted
5. Socket connection → JWT verified via cookie → User joined to room
```

### Real-time Architecture (Socket.io)

```
Client (Next.js)          Socket Server (port 4000)         Redis
     │                            │                             │
     │  Connect + JWT token       │                             │
     ├──────────────────────────►│                             │
     │                            │ Verify JWT                 │
     │                            ├─────────────────────────► │
     │  Join room (userId)        │                             │
     │◄──────────────────────────┤                             │
     │                            │                             │
     │                            │ Subscribe to "NEW_COMMENT" │
     │                            ├─────────────────────────► │
     │                            │                             │
     │                            │  (When comment created)    │
     │                            │  Publish to Redis          │
     │                            │◄──────────────────────────┤
     │                            │                             │
     │  Notification (comment)    │  Message from Redis         │
     │◄──────────────────────────┤◄────────────────────────────┤
     │                            │ Emit to author's room       │
```

### API Endpoints Summary

- **Auth**: `/api/auth/*` - Login, register, password reset, email verification
- **Posts**: `/api/post/*` - CRUD operations, feed
- **Comments**: `/api/comment/[postId]` - Create comments
- **Users**: `/api/user/[id]` - Get user profile

---
