# Home Listing API

REST API for authentication, profile management, and property listing management for the Home Listing application.

## Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Nodemailer
- `express-rate-limit`

## Features

- User registration and login
- Forgot-password flow with email verification code
- Authenticated password change
- Profile fetch and profile update
- Property creation, fetch, update, user-specific listing, and delete
- Rate limiting
- Health check endpoint

## Project Structure

```text
home-listing-api/
├── app.js
├── config/
│   └── env.js
├── controllers/
│   ├── auth.controllers.js
│   ├── profile.controllers.js
│   └── property.controllers.js
├── database/
│   └── mongodb.js
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── profile.modals.js
│   ├── properties.modal.js
│   └── user.modal.js
├── routes/
│   ├── auth.route.js
│   ├── profile.route.js
│   └── property.route.js
├── utils/
│   ├── email-template.js
│   └── sendEmail.js
├── package.json
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB connection string
- Email credentials for Nodemailer

## Environment Variables

In development, the app loads variables from `.env.local`.

```env
PORT=5000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password
FRONTEND_URL=https://your-frontend-url.com
```

### Notes

- `DB_URL` is required at startup.
- `JWT_SECRET` and `JWT_EXPIRES_IN` are used for login and registration tokens.
- `FRONTEND_URL` is used in welcome and reset-password emails.
- `.env.local` is only loaded when `NODE_ENV=development`.

## Installation

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

## Running Locally

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Default local URL:

```text
http://localhost:5000
```

## Authentication

Protected routes use the `authorise` middleware.

Send a token in either of these ways:

- `Authorization: Bearer <token>`
- `token` cookie

The API currently returns the JWT in the JSON response body after register and login.

## Base Route Prefixes

- Auth: `/api/v1/auth`
- Profile: `/api/v1/profile`
- Property: `/api/v1/property`

## Health And Root Endpoints

### `GET /`

Response:

```text
welcome to home listing API
```

### `GET /health`

Response:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

## Auth Endpoints

### `POST /api/v1/auth/register`

Creates a user, creates a matching profile, and returns a JWT.

Request body:

```json
{
  "fullname": "Raymond John",
  "email": "raymond@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id_here",
      "fullname": "Raymond John",
      "email": "raymond@example.com"
    }
  }
}
```

### `PUT /api/v1/auth/login`

Logs in an existing user and returns a JWT.

Request body:

```json
{
  "email": "raymond@example.com",
  "password": "password123"
}
```

### `POST /api/v1/auth/forgot-password`

Creates a 4-character reset token, stores it on the user, and emails it.

Request body:

```json
{
  "email": "raymond@example.com"
}
```

### `POST /api/v1/auth/createNewPassword`

Resets a password using email plus verification token.

Request body:

```json
{
  "email": "raymond@example.com",
  "password": "newPassword123",
  "token": "AB12"
}
```

### `PATCH /api/v1/auth/changePassword`

Protected route for changing the authenticated user's password.

Request body:

```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword123"
}
```

## Profile Endpoints

### `GET /api/v1/profile/get-user`

Protected route that returns the authenticated user's profile.

### `GET /api/v1/profile/user/:userId`

Returns a profile by user ID.

Example:

```http
GET /api/v1/profile/user/680ff0abc1234567890def12
```

### `GET /api/v1/profile/get-all-profiles`

Returns all profiles sorted by newest first.

### `PATCH /api/v1/profile/update-user/:userId`

Protected route for updating the authenticated user's own profile.

Important behavior:

- the controller ignores the `:userId` route param for authorization
- the actual user being updated comes from `req.user`
- only the logged-in user can update their own profile

Request body:

```json
{
  "fullname": "Raymond A. John",
  "email": "raymond@example.com",
  "gender": "male",
  "tele": "08012345678",
  "address": "Lagos, Nigeria",
  "avatar": "https://example.com/avatar.jpg"
}
```

Allowed profile fields:

- `avatar`
- `fullname`
- `email`
- `gender`
- `tele`
- `address`

Allowed `gender` values:

- `male`
- `female`
- `other`
- `prefer_not_to_say`

## Property Endpoints

### `GET /api/v1/property/get-all-properties`

Returns all properties.

This route is currently public.

### `POST /api/v1/property/create-property/`

Protected route for creating a property owned by the authenticated user.

Request body:

```json
{
  "title": "3 Bedroom Apartment",
  "description": "Spacious apartment in Lekki",
  "type": "rent",
  "currency": "NGN",
  "propertyType": "apartment",
  "price": 2500000,
  "location": "Lekki Phase 1",
  "status": "available",
  "images": [
    "https://example.com/image-1.jpg",
    "https://example.com/image-2.jpg"
  ],
  "city": "Lagos",
  "state": "Lagos",
  "bedrooms": 3,
  "bathrooms": 3,
  "amenities": ["wifi", "parking", "security"],
  "floorPlan": "https://example.com/floor-plan.jpg"
}
```

Required property fields from the schema:

- `title`
- `description`
- `type`
- `currency`
- `propertyType`
- `price`
- `location`
- `images`
- `city`
- `state`

Allowed `type` values:

- `rent`
- `sale`

Allowed `currency` values:

- `USD`
- `NGN`

Allowed `status` values:

- `available`
- `sold`

### `GET /api/v1/property/get-single-property/:propertyId`

Protected route that returns a single property by MongoDB `_id`.

### `PATCH /api/v1/property/update-property?propertyId=<property_id>`

Protected route that updates a property owned by the authenticated user.

Important behavior:

- `propertyId` is read from the query string, not the route path
- ownership is checked with `req.user._id`
- a client-supplied `userId` is not required and should not be trusted for authorization

Example:

```http
PATCH /api/v1/property/update-property?propertyId=69f65d7d9ab5ef5b01e545e8
```

Example request body:

```json
{
  "price": 3000000,
  "status": "available",
  "description": "Updated description"
}
```

### `GET /api/v1/property/get-user-properties/:userId`

Returns all properties for a given user ID.

This route is currently public.

### `DELETE /api/v1/property/delete-property/:propertyId`

Protected route that deletes a property only if it belongs to the authenticated user.

## Data Models

### User

Stored in `models/user.modal.js`.

Fields:

- `fullname`
- `email`
- `password`
- `resetPasswordToken`
- `resetPasswordExpiresAt`

### Profile

Stored in `models/profile.modals.js`.

Fields:

- `userId`
- `avatar`
- `fullname`
- `email`
- `gender`
- `tele`
- `address`

### Property

Stored in `models/properties.modal.js`.

Fields:

- `title`
- `description`
- `type`
- `currency`
- `propertyType`
- `price`
- `location`
- `status`
- `images`
- `user`
- `city`
- `state`
- `bedrooms`
- `bathrooms`
- `amenities`
- `floorPlan`
- `comments`

## Email Behavior

The API sends:

- welcome email after successful registration
- password reset email during forgot-password flow

Email sending is handled through Nodemailer in `utils/sendEmail.js`.

## Rate Limiting

Applied globally in `app.js`.

- Window: 15 minutes
- Max requests: 100 per IP

## Error Format

Most failures return JSON in this shape:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common status codes:

- `400` Bad Request
- `401` Unauthorized
- `404` Not Found
- `500` Internal Server Error

## Current Notes

- `update-user/:userId` in profile routes is misleading because the controller updates `req.user`, not the route param user.
- `get-single-property/:propertyId` is protected, while `get-all-properties` and `get-user-properties/:userId` are public.
- No automated tests are configured yet.

## Author

Raymond
