# Home Listing API

A REST API for a real-estate/home-listing platform. The API supports user authentication, profile management, property listings, comments, pagination, filtering, sorting, password recovery, and protected owner-only actions.

## Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Nodemailer
- `express-rate-limit`
- `cookie-parser`
- `cors`

## Features

- User registration and login with JWTs
- Automatic profile creation during registration
- Password reset by email
- Authenticated password change
- Current-user profile lookup
- Public profile lookup by user ID
- Profile updates with protected access
- Property creation, retrieval, update, and deletion
- Owner-only update and delete actions for properties
- Paginated property listing results
- Property filtering by search, type, currency, state, city, status, property type, and price range
- Property sorting by supported fields
- Comment creation, retrieval, and deletion
- Global API rate limiting
- CORS support for frontend clients
- Health check and API route index endpoints

## Project Structure

```text
home-listing-api/
├── app.js
├── config/
│   └── env.js
├── controllers/
│   ├── auth.controllers.js
│   ├── comments.controllers.js
│   ├── profile.controllers.js
│   └── property.controllers.js
├── database/
│   └── mongodb.js
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── comment.modals.js
│   ├── profile.modals.js
│   ├── properties.modal.js
│   └── user.modal.js
├── routes/
│   ├── auth.route.js
│   ├── comment.route.js
│   ├── profile.route.js
│   └── property.route.js
├── utils/
│   ├── email-template.js
│   └── sendEmail.js
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB connection string
- Email credentials for Nodemailer

## Environment Variables

In development, variables are loaded from `.env.local`.

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

Required at startup:

- `DB_URL`
- `JWT_SECRET`
- `PORT`

## Installation

Using pnpm:

```bash
pnpm install
```

Using npm:

```bash
npm install
```

## Running Locally

Development:

```bash
pnpm run dev
```

Production-style start:

```bash
pnpm start
```

Default local URL:

```text
http://localhost:5000
```

## Authentication

Protected routes use the `authorise` middleware.

Send the JWT in one of these ways:

- `Authorization: Bearer <token>`
- `token` cookie

Register and login responses include a JWT in the JSON response body.

## Base Routes

- Auth: `/api/v1/auth`
- Profile: `/api/v1/profile`
- Property: `/api/v1/property`
- Comment: `/api/v1/comment`

## Root And Health

### `GET /`

Returns a route index with available API endpoints.

### `GET /health`

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

## Auth Endpoints

### `POST /api/v1/auth/register`

Creates a user, creates a matching profile, and returns a JWT.

```json
{
  "fullname": "Raymond John",
  "email": "raymond@example.com",
  "password": "password123"
}
```

### `PUT /api/v1/auth/login`

Logs in an existing user and returns a JWT.

```json
{
  "email": "raymond@example.com",
  "password": "password123"
}
```

### `POST /api/v1/auth/forgot-password`

Creates a password reset token and sends it to the user's email.

```json
{
  "email": "raymond@example.com"
}
```

### `POST /api/v1/auth/createNewPassword`

Resets a password with an email and reset token.

```json
{
  "email": "raymond@example.com",
  "password": "newPassword123",
  "token": "AB12"
}
```

### `PATCH /api/v1/auth/changePassword`

Protected route for changing the authenticated user's password.

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

```http
GET /api/v1/profile/user/680ff0abc1234567890def12
```

### `GET /api/v1/profile/get-all-profiles`

Returns all profiles.

### `PATCH /api/v1/profile/update-user/:userId`

Protected route for updating a profile.

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

Returns properties with pagination, filtering, and sorting.

Example:

```http
GET /api/v1/property/get-all-properties?page=1&limit=10&type=rent&city=lagos&minPrice=100000&maxPrice=5000000&sortBy=price&order=asc
```

Supported query parameters:

| Parameter | Description | Default |
| --- | --- | --- |
| `page` | Page number. Minimum value is `1`. | `1` |
| `limit` | Number of properties per page. Minimum value is `1`. | `10` |
| `search` | Case-insensitive search across title, description, location, city, state, and property type. | empty |
| `type` | Filter by listing type: `rent` or `sale`. | none |
| `currency` | Filter by currency: `USD` or `NGN`. | none |
| `state` | Filter by state. | none |
| `city` | Filter by city. | none |
| `status` | Filter by status: `available` or `sold`. | none |
| `propertyType` | Filter by property type. | none |
| `minPrice` | Minimum property price. | none |
| `maxPrice` | Maximum property price. | none |
| `sortBy` | Sort field. | `createdAt` |
| `order` | Sort direction: `asc` or `desc`. | `desc` |

Supported `sortBy` values:

- `price`
- `type`
- `currency`
- `state`
- `city`
- `status`
- `propertyType`
- `createdAt`
- `updatedAt`

Response shape:

```json
{
  "success": true,
  "message": "Properties fetched successfully",
  "filters": {
    "search": "",
    "type": "rent",
    "currency": "NGN",
    "state": "Lagos",
    "city": "lagos",
    "status": "available",
    "propertyType": "apartment",
    "minPrice": "100000",
    "maxPrice": "5000000"
  },
  "sort": {
    "by": "price",
    "order": "asc"
  },
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### `POST /api/v1/property/create-property/`

Protected route for creating a property owned by the authenticated user.

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

Required property fields:

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

Returns a single property by MongoDB `_id`. The response includes populated comment owner names when comments exist.

```http
GET /api/v1/property/get-single-property/69f65d7d9ab5ef5b01e545e8
```

### `PATCH /api/v1/property/update-property?propertyId=<property_id>`

Protected route that updates a property owned by the authenticated user.

```http
PATCH /api/v1/property/update-property?propertyId=69f65d7d9ab5ef5b01e545e8
```

```json
{
  "price": 3000000,
  "status": "available",
  "description": "Updated description"
}
```

### `GET /api/v1/property/get-user-properties/:userId`

Protected route that returns all properties for a given user ID.

```http
GET /api/v1/property/get-user-properties/680ff0abc1234567890def12
```

### `DELETE /api/v1/property/delete-property/:propertyId`

Protected route that deletes a property only if it belongs to the authenticated user.

```http
DELETE /api/v1/property/delete-property/69f65d7d9ab5ef5b01e545e8
```

## Comment Endpoints

### `POST /api/v1/comment/post-comment/:propertyId`

Protected route for adding a comment to a property.

```http
POST /api/v1/comment/post-comment/69f65d7d9ab5ef5b01e545e8
```

```json
{
  "content": "Is this property still available?"
}
```

### `GET /api/v1/comment/get-property-comments/:propertyId`

Returns comments for a property with the comment owner's `fullname` populated.

```http
GET /api/v1/comment/get-property-comments/69f65d7d9ab5ef5b01e545e8
```

### `DELETE /api/v1/comment/delete-comment/:commentId`

Protected route that deletes a comment only if it belongs to the authenticated user. The deleted comment is also removed from the related property's `comments` array.

```http
DELETE /api/v1/comment/delete-comment/680ff0abc1234567890def12
```

## Data Models

### User

Stored in `models/user.modal.js`.

- `fullname`
- `email`
- `password`
- `resetPasswordToken`
- `resetPasswordExpiresAt`

### Profile

Stored in `models/profile.modals.js`.

- `userId`
- `avatar`
- `fullname`
- `email`
- `gender`
- `tele`
- `address`

### Property

Stored in `models/properties.modal.js`.

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

### Comment

Stored in `models/comment.modals.js`.

- `content`
- `owner`
- `property`

## Rate Limiting

Rate limiting is applied globally in `app.js`.

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

## Notes

- `GET /api/v1/property/get-all-properties` is public.
- `GET /api/v1/property/get-user-properties/:userId` is protected by the route middleware.
- `PATCH /api/v1/property/update-property` reads `propertyId` from the query string.
- No automated tests are configured yet.

## Author

Raymond
