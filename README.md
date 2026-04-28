# Home Listing API

Backend API for user authentication and profile management for the Home Listing application.

This project is built with:

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for email delivery

## Features

- User registration
- User login
- Forgot-password flow with email token
- Authenticated password change
- Fetch current user profile
- Fetch profile by user ID
- Update current user profile
- List all profiles
- Basic rate limiting
- Health check endpoint for deployment platforms like Render

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
└── utils/
    ├── email-template.js
    └── sendEmail.js
```

## Requirements

Before running the project, make sure you have:

- Node.js 18 or later
- MongoDB connection string
- A Gmail account or SMTP-compatible account for email sending

## Environment Variables

Create a `.env.local` file for local development.

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

### Variable Notes

- `PORT`: Port the server listens on.
- `NODE_ENV`: Use `development` locally. Render usually sets this to `production`.
- `DB_URL`: MongoDB connection string.
- `JWT_SECRET`: Secret used to sign JWT tokens.
- `JWT_EXPIRES_IN`: JWT expiry value, for example `7d`.
- `EMAIL_USER`: Email address used to send welcome and reset emails.
- `EMAIL_PASSWORD`: App password or SMTP password for the email account.
- `FRONTEND_URL`: Frontend base URL used in email links.

## Installation

Install dependencies with either npm or pnpm.

```bash
npm install
```

or

```bash
pnpm install
```

## Running Locally

Start the development server:

```bash
npm run dev
```

Start in normal mode:

```bash
npm start
```

If startup is successful, the API will be available at:

```text
http://localhost:5000
```

## Health Check

Use this endpoint to confirm the API is running:

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

## Authentication

Protected routes use JWT authentication.

Send the token in the `Authorization` header like this:

```http
Authorization: Bearer <your_token>
```

The auth middleware also supports a token stored in cookies, but the current controllers return the token in JSON response bodies.

## API Base URL

Local base URL:

```text
http://localhost:5000
```

Route prefixes:

- Auth routes: `/api/v1/auth`
- Profile routes: `/api/v1/profile`

## API Endpoints

### Root

#### `GET /`

Returns a simple welcome message.

Response:

```text
welcome to home listing API
```

### Auth Endpoints

#### `POST /api/v1/auth/register`

Registers a new user and creates a matching profile.

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

Notes:

- A `User` document and `Profile` document are created together.
- A welcome email is attempted after registration.

#### `PUT /api/v1/auth/login`

Logs in an existing user.

Request body:

```json
{
  "email": "raymond@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "User logged in successfully",
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

#### `POST /api/v1/auth/forgot-password`

Generates a reset token and sends it to the user by email.

Request body:

```json
{
  "email": "raymond@example.com"
}
```

Success response:

```json
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

Notes:

- The reset token currently expires after 1 hour.
- The token is stored in the `User` document.

#### `POST /api/v1/auth/createNewPassword`

Creates a new password using the email and reset token.

Request body:

```json
{
  "email": "raymond@example.com",
  "password": "newPassword123",
  "token": "AB12"
}
```

Success response:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### `PATCH /api/v1/auth/changePassword`

Changes the password for the currently authenticated user.

Headers:

```http
Authorization: Bearer <your_token>
```

Request body:

```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Profile Endpoints

#### `GET /api/v1/profile/get-user`

Returns the currently authenticated user's profile.

Headers:

```http
Authorization: Bearer <your_token>
```

Success response:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "profile_id_here",
    "userId": "user_id_here",
    "fullname": "Raymond John",
    "email": "raymond@example.com",
    "gender": "prefer_not_to_say",
    "tele": "",
    "address": "",
    "createdAt": "2026-04-29T00:00:00.000Z",
    "updatedAt": "2026-04-29T00:00:00.000Z"
  }
}
```

#### `GET /api/v1/profile/user/:userId`

Returns a profile by the owning user's ID.

Headers:

```http
Authorization: Bearer <your_token>
```

Example:

```http
GET /api/v1/profile/user/680ff0abc1234567890def12
```

#### `GET /api/v1/profile/get-all-profiles`

Returns all profiles sorted by newest first.

Success response:

```json
{
  "success": true,
  "message": "Profiles fetched successfully",
  "count": 2,
  "data": []
}
```

#### `PATCH /api/v1/profile/update-user`

Updates the currently authenticated user's profile.

Headers:

```http
Authorization: Bearer <your_token>
```

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

Notes:

- You can send only the fields you want to update.
- `fullname` and `email` are kept in sync between the `User` and `Profile` collections.
- The update is wrapped in a transaction to avoid partial writes.

### Allowed Profile Fields

The profile model supports these fields:

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

## Email Behavior

The API sends:

- Welcome emails after successful registration
- Password reset emails during the forgot-password flow

Email sending is configured in `utils/sendEmail.js` using Nodemailer.

For Gmail, use an app password instead of your normal account password.

## Rate Limiting

The API uses `express-rate-limit` with the current configuration:

- Window: 15 minutes
- Limit: 100 requests per IP

## Deployment Notes for Render

When deploying to Render:

1. Set all required environment variables in the Render dashboard.
2. Make sure your MongoDB deployment supports transactions.
3. Use `npm start` as the start command.
4. Use `/health` as the health check path if needed.

Recommended Render environment variables:

```env
PORT=10000
NODE_ENV=production
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password
FRONTEND_URL=https://your-frontend-url.com
```

## Error Responses

Most endpoints return JSON in this format on failure:

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

## Known Notes

- Property routes and controllers exist in the codebase, but they are not currently mounted in `app.js`.
- There are no automated tests configured yet.

## Author

Raymond
