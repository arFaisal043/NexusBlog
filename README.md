# NexusBlog

<div align="center">

![NexusBlog Banner](https://img.shields.io/badge/NexusBlog-REST%20API-6C63FF?style=for-the-badge&logo=node.js&logoColor=white)

**A modern, feature-rich blog REST API with premium content monetization powered by Stripe.**

[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

</div>

---

## 📖 Description

**NexusBlog** is a production-ready, RESTful blog backend API built with **Node.js**, **Express 5**, and **TypeScript**. It provides a complete blogging platform with support for multi-role user management, rich content operations, social features (reactions, comments, bookmarks), and a **Stripe-powered premium subscription system** for monetizing exclusive content.

The API is engineered for security and scalability — featuring JWT-based authentication with refresh tokens, request rate limiting, Helmet security headers, CORS configuration, global error handling, and a clean modular architecture using Prisma ORM with a multi-file PostgreSQL schema.

---

## ✅ NexusBlog System Design
![System Design](NexusBlog_System_Design.png)

## 🏅 Badges

![GitHub repo size](https://img.shields.io/github/repo-size/arFaisal043/prisma-blog-app?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/arFaisal043/prisma-blog-app?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/arFaisal043/prisma-blog-app?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/arFaisal043/prisma-blog-app?style=flat-square)
[![Node.js CI](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

---

## 📋 Table of Contents

- [Description](#-description)
- [Badges](#-badges)
- [Features](#-features)
- [Demo / Screenshots](#-demo--screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage / Quick Start](#-usage--quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements / Credits](#-acknowledgements--credits)
- [Contact](#-contact)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT Access & Refresh Token** flow with secure `httpOnly` cookie storage
- **Role-Based Access Control (RBAC)** — three roles: `USER`, `AUTHOR`, `ADMIN`
- Bcrypt password hashing with configurable salt rounds
- Optional authentication middleware for public endpoints with enriched context

### 👤 User Management
- User registration with Zod schema validation
- Profile viewing and updating
- Admin-only user deletion

### 📝 Post Management
- Full CRUD operations for blog posts (title, content, tags, thumbnail)
- Post status lifecycle: `PUBLISHED`, `DRAFT`, `ARCHIVED`
- **Featured & Premium post** flags
- View count tracking
- Paginated post listings, personal feed, and popular posts endpoint
- Admin-only post statistics dashboard

### 💬 Comments
- Create, read, update, and delete comments on posts
- **Admin comment moderation** — approve or reject comments (`APPROVED` / `REJECT`)
- Premium post gating — only active subscribers can comment on premium posts
- Owner-only edit/delete with admin override

### 👍 Reactions
- Toggle `LIKE` / `DISLIKE` reactions on posts
- Reaction state toggling (re-reacting removes the reaction)

### 🔖 Bookmarks
- Toggle bookmarks on posts
- Paginated personal bookmark feed with full post + author details
- Premium content bookmark gating for subscriber-only posts

### 💳 Premium Subscriptions (Stripe)
- Stripe Checkout Session creation for premium plan purchase
- Subscription cancellation endpoint
- Real-time subscription status check
- Stripe Webhook integration for event-driven subscription lifecycle management
- `subscriptionGuard` middleware protecting premium content routes

### 🛡️ Security & Performance
- **Helmet** for HTTP security headers
- **express-rate-limit** — 100 requests per 15 min per IP
- **CORS** with configurable origin
- **Morgan** request logging (dev/combined mode based on `NODE_ENV`)
- Global error handler with consistent error response shape
- Zod request validation middleware

---

## 🖥️ Demo / Screenshots

> **Base URL:** `http://localhost:5000`

### Health Check
```bash
curl http://localhost:5000/
```
```json
{
  "status": "OK",
  "message": "Welcome to NexusBlog!"
}
```

### Sample: Register a User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com", "password": "securePass123"}'
```

### Sample: Create a Post (Authenticated)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{"title": "My First Post", "content": "Hello NexusBlog!", "tags": ["tech", "nodejs"]}'
```

> 💡 Import the full collection into **Postman** or **Thunder Client** using the routes listed in the [API Reference](#-api-reference) section below.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 22+ |
| **Language** | TypeScript 7.x |
| **Framework** | Express 5.x |
| **ORM** | Prisma 7.x |
| **Database** | PostgreSQL 16 (via `pg` driver + `@prisma/adapter-pg`) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) |
| **Validation** | Zod 4.x |
| **Payments** | Stripe 22.x |
| **Security** | Helmet, CORS, express-rate-limit |
| **Logging** | Morgan |
| **Dev Tools** | `tsx` (watch mode), TypeScript compiler |

---

## 🚀 Installation

### Prerequisites

- **Node.js** v22 or higher
- **npm** v10 or higher
- A running **PostgreSQL** instance (local or cloud)
- A **Stripe** account (for subscription features)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/arFaisal043/prisma-blog-app.git
   cd prisma-blog-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```
   See the [Configuration](#-configuration) section for details on each variable.

4. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate the Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`.

---

## ⚡ Usage / Quick Start

After installation, the server starts at `http://localhost:5000`. Follow these steps to get started quickly:

1. **Register a user**
   ```
   POST /api/users/register
   ```

2. **Login to get your JWT tokens**
   ```
   POST /api/auth/login
   ```
   The response will set `accessToken` and `refreshToken` cookies automatically.

3. **Create your first blog post**
   ```
   POST /api/posts
   ```
   Include the JWT in the `Authorization: Bearer <token>` header or via cookie.

4. **Explore all features** using the endpoints in the [API Reference](#-api-reference) below.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot-reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build |
| `npm run stripe:webhook` | Forward Stripe webhook events to local server |

---

## ⚙️ Configuration

Create a `.env` file in the project root. All required variables are listed below:

```env
# ─── Database ────────────────────────────────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# ─── Server ──────────────────────────────────────────────
PORT=5000
APP_URL=http://localhost:5000      # Allowed CORS origin

# ─── Password Hashing ────────────────────────────────────
BCRYPT_SALT_ROUNDS=10

# ─── JWT ─────────────────────────────────────────────────
JWT_SECRET_KEY=your_super_secret_access_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET_KEY=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=7d

# ─── Stripe ──────────────────────────────────────────────
STRIPE_PRODUCT_ID=prod_XXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXX
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `PORT` | ✅ | Port the HTTP server listens on |
| `APP_URL` | ✅ | Allowed CORS origin (your frontend URL) |
| `BCRYPT_SALT_ROUNDS` | ✅ | Bcrypt hashing cost factor (recommended: 10–12) |
| `JWT_SECRET_KEY` | ✅ | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | ✅ | Access token expiry (e.g., `1d`, `2h`) |
| `JWT_REFRESH_SECRET_KEY` | ✅ | Secret for signing refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | Refresh token expiry (e.g., `7d`) |
| `STRIPE_PRODUCT_ID` | ⚠️ | Stripe Product ID for the premium plan |
| `STRIPE_SECRET_KEY` | ⚠️ | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ | Stripe webhook endpoint secret |

> ⚠️ Stripe variables are only required if you are using the subscription/premium features.

---

## 📚 API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid JWT token via `Authorization: Bearer <token>` header or cookie.

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/login` | ❌ | Login and receive access + refresh tokens |
| `POST` | `/refresh-token` | ❌ | Issue a new access token using the refresh token |

---

### 👤 Users — `/api/users`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/register` | ❌ | — | Register a new user account |
| `GET` | `/me` | ✅ | Any | Get the authenticated user's profile |
| `PUT` | `/my-profile` | ✅ | Any | Update the authenticated user's profile |
| `DELETE` | `/:id` | ✅ | `ADMIN` | Delete a user by ID |

---

### 📝 Posts — `/api/posts`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/` | ✅ | Any | Create a new blog post |
| `GET` | `/` | ❌ | — | Get all published posts (paginated) |
| `GET` | `/my-post` | ✅ | Any | Get the authenticated user's posts |
| `GET` | `/stats` | ✅ | `ADMIN` | Get aggregate post statistics |
| `GET` | `/popular` | ❌ | — | Get popular posts sorted by views/reactions |
| `GET` | `/:postId` | Optional | — | Get a single post by ID (premium check applied) |
| `PATCH` | `/:postId` | ✅ | Any | Update a post (owner or admin only) |
| `DELETE` | `/:postId` | ✅ | Any | Delete a post (owner or admin only) |

---

### 💬 Comments — `/api/comments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✅ | Create a comment on a post |
| `GET` | `/my-comments` | ✅ | Get all comments by the authenticated user |
| `GET` | `/:commentId` | ❌ | Get a comment by its ID |
| `PUT` | `/:commentId` | ✅ | Update a comment (owner or admin) |
| `DELETE` | `/:commentId` | ✅ | Delete a comment (owner or admin) |
| `PATCH` | `/:commentId/moderate` | ✅ `ADMIN` | Approve or reject a comment |

---

### 👍 Reactions — `/api/reactions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/:postId` | ✅ | Toggle a `LIKE` or `DISLIKE` reaction on a post |

**Request Body:**
```json
{ "type": "LIKE" }
```

---

### 🔖 Bookmarks — `/api/bookmarks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/:postId` | ✅ | Toggle bookmark on a post |
| `GET` | `/` | ✅ | Get paginated list of the user's bookmarks |

---

### 💳 Subscriptions — `/api/subscription`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create-checkout-session` | ✅ | Create a Stripe Checkout session for premium plan |
| `POST` | `/cancel` | ✅ | Cancel the authenticated user's subscription |
| `POST` | `/webhook` | ❌ | Stripe webhook receiver (raw body required) |
| `GET` | `/subscription-status` | ✅ | Get the current subscription status of the user |

---

### 🌟 Premium Content — `/api/premium`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | ✅ | Active Subscriber | Fetch all premium posts (subscription-gated) |

---

## 🗺️ Roadmap

- [ ] **Email Verification** — send confirmation emails on registration
- [ ] **Password Reset** — forgot password flow via email OTP
- [ ] **File Uploads** — image/thumbnail upload via AWS S3 or Cloudinary
- [ ] **Nested Comments** — threaded comment replies
- [ ] **Notification System** — real-time notifications via WebSockets
- [ ] **Post Search** — full-text search with pagination
- [ ] **Admin Dashboard Endpoints** — comprehensive analytics APIs
- [ ] **Automated Tests** — Jest unit + integration test suite
- [ ] **Docker Support** — `Dockerfile` and `docker-compose.yml` for containerized deployment
- [ ] **CI/CD Pipeline** — GitHub Actions workflow for automated testing and deployment
- [ ] **Swagger / OpenAPI Docs** — auto-generated interactive API documentation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-amazing-feature
   ```
3. **Commit** your changes with a descriptive message
   ```bash
   git commit -m "feat: add your amazing feature"
   ```
4. **Push** to your fork
   ```bash
   git push origin feature/your-amazing-feature
   ```
5. **Open a Pull Request** against the `main` branch

### Code Style Guidelines

- Follow the existing modular file structure (`controller`, `service`, `route`, `validation`, `interface` per module)
- Use **Zod** for all incoming request validation
- Use `catchAsync` utility for async route handlers
- Use `sendSuccess` / `CustomError` utilities for consistent response shaping
- Keep controllers thin — business logic belongs in services

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](./LICENSE) file for details.

```
ISC License

Copyright (c) 2026 arFaisal043

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

---

## 🙏 Acknowledgements / Credits

- **[Prisma](https://www.prisma.io/)** — Next-generation Node.js ORM that makes database work a joy
- **[Express.js](https://expressjs.com/)** — Fast, unopinionated web framework for Node.js
- **[Stripe](https://stripe.com/)** — Best-in-class payments infrastructure
- **[Zod](https://zod.dev/)** — TypeScript-first schema validation with static type inference
- **[Helmet](https://helmetjs.github.io/)** — Securing Express apps with HTTP headers
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** — JWT implementation for Node.js
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — Optimized bcrypt in JavaScript
- **[morgan](https://github.com/expressjs/morgan)** — HTTP request logger middleware

---

## 📬 Contact

**arFaisal043**

[![GitHub](https://img.shields.io/badge/GitHub-arFaisal043-181717?style=flat-square&logo=github)](https://github.com/arFaisal043)

> 💡 Found a bug or have a feature request? Please [open an issue](https://github.com/arFaisal043/prisma-blog-app/issues/new) on GitHub.

---

<div align="center">
Made with ❤️ using Node.js, TypeScript & Prisma
</div>
