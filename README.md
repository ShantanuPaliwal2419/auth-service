# 🔐 Auth-Service

A production-ready **Authentication Service** built using **Bun**, **Express**, **TypeScript**, **Drizzle ORM**, and **PostgreSQL**.  
This service implements modern authentication best practices including **JWT (RS256)**, **refresh token rotation**, and **key rotation**.

---

## 📌 Features

- ✅ JWT Authentication using **RS256**
- 🔄 **Refresh Token Rotation** (secure & replay-safe)
- 🔑 **JWT Key Rotation** support
- 🍪 HTTP-only, secure cookies
- 🔒 Protected routes via middleware
- 🧱 Modular and scalable architecture
- ⚡ Built with **Bun** for high performance
- 🛡 Secure password hashing using bcrypt

---

## 🧠 Tech Stack

| Layer | Technology |
|-----|-----------|
| Runtime | Bun |
| Server | Express |
| Language | TypeScript |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| Auth | JWT (RS256) |
| Security | bcrypt, httpOnly cookies |

---

## 📁 Project Structure

```text
auth-service/
├── src/
│   ├── controller/        # Request handlers
│   ├── middleware/        # Auth & error middleware
│   ├── routes/            # Express routes
│   ├── db/                # Drizzle schema & config
│   ├── utils/             # JWT, hashing, key utils
│   ├── services/          # Business logic
│   └── index.ts           # App entry point
├── drizzle/               # Migrations
├── .env.example           # Environment variables
├── bunfig.toml
├── tsconfig.json

```


 ---

## 🗄️ Database Schema (PostgreSQL)

This service uses **PostgreSQL** with **Drizzle ORM**.  
The schema is designed to support **secure authentication**, **refresh token rotation**, and **JWT key rotation**.

---

## 👤 Users Table

Stores user account information.

### Purpose
- Represents an authenticated user
- Used during login, token generation, and authorization

### Schema

| Column            | Type                    | Constraints      | Default           | Description               |
| ----------------- | ----------------------- | ---------------- | ----------------- | ------------------------- |
| `id`              | UUID                    | PK               | `defaultRandom()` | Unique user identifier    |
| `name`            | VARCHAR(256)            | NOT NULL         | -                 | User name                 |
| `email`           | VARCHAR(256)            | UNIQUE, NOT NULL | -                 | User email                |
| `password`        | TEXT                    | NOT NULL         | -                 | Hashed password           |
| `isEmailVerified` | BOOLEAN                 | NOT NULL         | `false`           | Email verification status |
| `isActive`        | BOOLEAN                 | NOT NULL         | `true`            | Active user status        |
| `created_at`      | TIMESTAMP WITH TIMEZONE | NOT NULL         | `NOW()`           | Account creation time     |

---

## 🔄 Refresh Tokens Table

Stores refresh tokens to enable **token rotation** and **session tracking**.

### Purpose
- Allows refresh token rotation
- Detects token reuse (replay attacks)
- Supports logout & session invalidation

### Schema

| Column              | Type                    | Constraints             | Default           | Description                  |
| ------------------- | ----------------------- | ----------------------- | ----------------- | ---------------------------- |
| `id`                | UUID                    | PK                      | `defaultRandom()` | Refresh token ID             |
| `userId`            | UUID                    | NOT NULL, FK → users.id | -                 | Owner of the token           |
| `token_hash`        | TEXT                    | UNIQUE, NOT NULL        | -                 | Hashed refresh token         |
| `revoked`           | BOOLEAN                 | NOT NULL                | `false`           | Token revocation status      |
| `expires_at`        | TIMESTAMP WITH TIMEZONE | NOT NULL                | -                 | Token expiration time        |
| `created_at`        | TIMESTAMP WITH TIMEZONE | NOT NULL                | `NOW()`           | Token creation time          |
| `replaced_by_token` | UUID                    | Nullable                | -                 | ID of the next rotated token |


### 🔐 Why store hashed refresh tokens?

- Prevents token leakage from DB
- Same security model as passwords
- Protects against database compromise

---

## 🔑 JWT Keys Table

Stores RSA public keys used for JWT **verification**.

### Purpose
- Enables **JWT key rotation**
- Allows validating tokens signed with older keys
- Supports `kid`-based verification

### Schema

| Column       | Type                    | Constraints | Default | Description                                 |
| ------------ | ----------------------- | ----------- | ------- | ------------------------------------------- |
| `kid`        | VARCHAR(56)             | PK          | -       | Key ID (JWT header `kid`)                   |
| `publicKey`  | TEXT                    | NOT NULL    | -       | RSA public key                              |
| `privateKey` | TEXT                    | NOT NULL    | -       | RSA private key                             |
| `algorithm`  | VARCHAR(10)             | NOT NULL    | -       | Signing algorithm (`RS256`)                 |
| `status`     | VARCHAR(10)             | NOT NULL    | -       | Key status (`ACTIVE`, `ROTATED`, `REVOKED`) |
| `createdAt`  | TIMESTAMP WITH TIMEZONE | NOT NULL    | `NOW()` | Key creation time                           |
| `expiresAt`  | TIMESTAMP WITH TIMEZONE | Nullable    | -       | Key expiration time                         |


# 🧰 Utilities (`utils`) Overview

This table lists all utility files in the `utils` folder along with their purpose.

| File / Function Name         | Purpose / Description                                           |
|-------------------------------|----------------------------------------------------------------|
| `ApiError.ts`                 | Standardizes API errors across the service                     |
| `ApiResponse.ts`              | Provides a consistent API response format for endpoints       |
| `generateAccessToken.ts`      | Generates JWT access tokens signed with RS256                 |
| `generateRefreshToken.ts`     | Generates refresh tokens for user sessions                     |
| `keyGenerator.ts`             | Generates RSA key pairs for JWT signing (RS256)               |
| `jwtBootstrap.ts`             | Bootstraps JWT system and initializes key rotation on start   |
 

---
# 📡 API Endpoints

This table summarizes all user-related API endpoints.

| Endpoint Name               | Description                                      | Route                       |
|------------------------------|-------------------------------------------------|-----------------------------|
| Register                     | Registers a new user                             | `POST /register`            |
| Login                        | Authenticates a user and returns access token   | `POST /login`               |
| Email Verified               | Verifies user's email                            | `POST /email-verified`      |
| Logout                       | Logs out the user                                | `GET /logout`               |
| Revoke Refresh Token         | Revokes user's refresh token                     | `GET /revoke-refresh-token` |
| Rotate JWT Key               | Rotates the active JWT signing key              | `GET /rotate-jwt-key`       |

## 💻 Installation & Running

### 1. Clone the repository
```bash
git clone https://github.com/ShantanuPaliwal2419/auth-service.git
cd auth-service
```
### 2. Install the Dependencies
```bash
bun install
```
### 3.Set up Enviourment Variables 
```bash
DATABASE_URL=postgres://username:password@localhost:5432/authdb
JWT_ISSUER=your_issuer
JWT_AUDIENCE=your_audience
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=30d

```
### 4. Run database migrations
```bash
bun run migrate
# or if using Drizzle CLI
drizzle-kit migrate
```
### 5. Start the server
```bash
bun run dev


```

