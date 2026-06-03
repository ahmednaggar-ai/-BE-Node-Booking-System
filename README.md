# Booking System API

A RESTful booking management API built with **Node.js**, **Express 5**, and **MongoDB**. Users can register, log in with JWT, and manage their bookings (create, list, filter, update status, and cancel).

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Express 5](https://expressjs.com/) | HTTP server & routing |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM |
| [Zod](https://zod.dev/) | Request validation |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | JWT authentication |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variables |

## Project Structure

```
Booking system/
├── config/
│   ├── .env                 # Local secrets (not committed)
│   └── env.service.js       # Loads env config
├── src/
│   ├── main.js              # App entry point
│   ├── app.controller.js    # Express bootstrap & routes
│   ├── common/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js      # JWT verification
│   │   │   └── validate.middleware.js  # Zod validation
│   │   ├── validators/
│   │   │   └── common.validator.js     # Shared schemas (ObjectId, etc.)
│   │   └── responses/
│   │       ├── success.response.js
│   │       └── error.response.js
│   ├── database/
│   │   ├── connection.js
│   │   └── models/
│   │       ├── user.model.js
│   │       └── booking.model.js
│   └── modules/
│       ├── user/
│       │   ├── user.route.js
│       │   ├── user.controller.js
│       │   └── user.validator.js
│       └── booking/
│           ├── booking.route.js
│           ├── booking.controller.js
│           └── booking.validator.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a remote connection string)

### Installation

```bash
npm install
```

### Environment Variables

Create `config/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/booking-system
JWT_SECRET=your-secret-key-here
```

### Run the Server

```bash
npm run dev
```

Server starts at `http://localhost:3000` (or your configured `PORT`).

### Health Check

```http
GET /health
```

---

## Authentication

Protected routes require a JWT in the `Authorization` header.

**Supported formats:**

```
Authorization: Bearer <token>
Authorization: <token>
```

Obtain a token via `POST /api/user/login`. The token payload includes `userId` and expires in **1 hour**.

---

## API Response Format

### Success

```json
{
  "success": true,
  "message": "Operation message",
  "data": { }
}
```

### Error

```json
{
  "success": false,
  "message": "Error message",
  "error": "Validation detail or null"
}
```

Validation errors (from Zod) return `400` with an array of issues in `error`:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": [
    { "path": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

---

## User Endpoints

Base path: `/api/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | No | Create a new user |
| `POST` | `/login` | No | Login and receive JWT |
| `GET` | `/byId` | Yes | Get logged-in user profile (password excluded) |

### Register

```http
POST /api/user/register
Content-Type: application/json

{
  "fullName": "Ahmed Hossam",
  "email": "ahmed@gmail.com",
  "password": "12345678"
}
```

### Login

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "ahmed@gmail.com",
  "password": "12345678"
}
```

**Response `data`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile

```http
GET /api/user/byId
Authorization: <token>
```

---

## Booking Endpoints

Base path: `/api/booking`

**All booking routes require authentication.**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/create` | Create a booking |
| `GET` | `/getUserBookings` | List current user's bookings (filter/sort/search) |
| `GET` | `/:id` | Get booking by ID |
| `PATCH` | `/:id` | Update booking status (`pending` or `confirmed` only) |
| `DELETE` | `/:id` | Soft-cancel booking (sets `status` to `cancelled`) |

### Create Booking

```http
POST /api/booking/create
Authorization: <token>
Content-Type: application/json

{
  "userId": "6a207a8ebead6644258a6cf6",
  "title": "Doctor Appointment",
  "bookingDate": "2026-06-15T10:00:00.000Z",
  "status": "pending"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `userId` | Yes | Valid MongoDB ObjectId (24 hex chars) |
| `title` | Yes | Non-empty string |
| `bookingDate` | Yes | ISO date string |
| `status` | No | `pending`, `confirmed`, or `cancelled` (defaults to `pending`) |

> Use the same `userId` as the logged-in user if you want the booking to appear in `getUserBookings`.

### Get User Bookings

```http
GET /api/booking/getUserBookings
Authorization: <token>
```

**Optional query parameters** (use any combination):

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `pending`, `confirmed`, `cancelled` | Filter by status |
| `search` | any string | Case-insensitive partial match on `title` |
| `sort` | `bookingDate` | Sort by booking date |
| `order` | `asc`, `desc` | Sort direction (requires `sort`; defaults to `asc`) |

**Examples:**

```
GET /api/booking/getUserBookings
GET /api/booking/getUserBookings?status=pending
GET /api/booking/getUserBookings?search=doctor
GET /api/booking/getUserBookings?sort=bookingDate&order=desc
GET /api/booking/getUserBookings?status=confirmed&search=hotel&sort=bookingDate
```

No query params → returns **all** bookings for the authenticated user.

### Get Booking by ID

```http
GET /api/booking/:id
Authorization: <token>
```

### Update Booking Status

Only `status` can be updated. Allowed values: `pending`, `confirmed` (not `cancelled`).

```http
PATCH /api/booking/:id
Authorization: <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

Only the booking owner (matching JWT `userId`) can update.

### Cancel Booking (Soft Delete)

Does not remove the document — sets `status` to `cancelled`.

```http
DELETE /api/booking/:id
Authorization: <token>
```

---

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| `fullName` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Hashed with bcrypt, min 8 chars |
| `createdAt` / `updatedAt` | Date | Auto timestamps |

### Booking

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Ref to User |
| `title` | String | Required |
| `bookingDate` | Date | Required |
| `status` | String | `pending` \| `confirmed` \| `cancelled` |
| `createdAt` / `updatedAt` | Date | Auto timestamps |

---

## Business Rules

- Passwords are hashed before storage; never returned in API responses.
- Booking **update** only changes `status` to `pending` or `confirmed`.
- Booking **delete** is a soft delete: status becomes `cancelled`.
- `getUserBookings` always scopes results to the authenticated user's `userId`.
- `updateBooking` and `cancelBooking` only affect bookings owned by the authenticated user.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (auto-reload) |

---

## License

ISC
