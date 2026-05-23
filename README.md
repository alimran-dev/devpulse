# DevPulse

DevPulse is a small issue-tracking REST API built with TypeScript and Express. It provides user authentication (signup/login) and issue management with role-based access controls for `contributor` and `maintainer` roles.

## Live URL

- Base URL (Vercel): [https://devpulse-three-ashen.vercel.app](https://devpulse-three-ashen.vercel.app)

## Features

- User signup and login (passwords hashed with bcrypt)
- JWT-based authentication with role claims (`contributor` | `maintainer`)
- Issue CRUD: create, read (single & list), update, delete
- Role-based route protection (only authorized roles can create/update/delete)
- Query parameters for listing issues: filtering and sorting

## Tech Stack

- Node.js + TypeScript
- Express
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`) for auth
- `bcryptjs` for password hashing
- Deployed with Vercel (optional)

## Quick Setup

Prerequisites

- Node.js (>= 18) and npm
- PostgreSQL database

Local install

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with the following variables

```
PORT=3000
DB_CONNECTION=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
ACCESS_TOKEN_SECRET=your_jwt_secret
```

3. Run the server in development

```bash
npm run dev
```

Or build and run the compiled output

```bash
npm run build
npm start
```

## API Endpoints

Base paths mounted in the app:

- Authentication: `/api/auth`
- Issues: `/api/issues`

Authentication

- POST /api/auth/signup
  - Description: Register a new user
  - Body (JSON):
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "securePassword",
      "role": "contributor" // or "maintainer"
    }
    ```
  - Response: created user object (password omitted)

- POST /api/auth/login
  - Description: Login and receive a JWT
  - Body (JSON):
    ```json
    {
      "email": "jane@example.com",
      "password": "securePassword"
    }
    ```
  - Response: `{ "token": "<jwt>", "user": { /* user object */ } }`

Issues

- GET /api/issues
  - Description: Get all issues. Supports query params: `sort`, `type`, `status`.
  - Auth: public

- GET /api/issues/:id
  - Description: Get single issue by id
  - Auth: public

- POST /api/issues
  - Description: Create a new issue. Requires authentication and role `contributor` or `maintainer`.
  - Auth: `Authorization: Bearer <token>`
  - Body (JSON):
    ```json
    {
      "title": "Bug in login",
      "description": "Login fails when...",
      "type": "bug"
    }
    ```

- PATCH /api/issues/:id
  - Description: Update an issue. Requires auth with role `maintainer` or `contributor`.
  - Auth: `Authorization: Bearer <token>`
  - Body (JSON): partial fields to update (e.g. `title`, `description`, `status`, `type`)

- DELETE /api/issues/:id
  - Description: Delete an issue. Requires auth with role `maintainer`.
  - Auth: `Authorization: Bearer <token>`

## Database Schema Summary

The project uses PostgreSQL. The following schema matches the interfaces in `src/modules/*/*.interface.ts`.

Users table (example)

```sql
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	role VARCHAR(20) NOT NULL CHECK (role IN ('contributor','maintainer'))
);
```

Issues table (example)

```sql
CREATE TABLE issues (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	type VARCHAR(20) NOT NULL CHECK (type IN ('bug','feature_request')),
	status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
	reporter_id INTEGER REFERENCES users(id),
	created_at TIMESTAMP DEFAULT now(),
	updated_at TIMESTAMP DEFAULT now()
);
```

## Environment variables

- `PORT` — server port (e.g. 3000)
- `DB_CONNECTION` — PostgreSQL connection string
- `ACCESS_TOKEN_SECRET` — secret for signing JWTs

## Notes

- Authentication middleware expects the token in the `Authorization` header as `Bearer <token>`.
- The login response contains `{ token, user }` where `user` has `id`, `name`, `email`, `role`.
- Replace the Live URL placeholder with your actual deployment URL after you deploy.

## Where to look in the code

- App entry: [src/app.ts](src/app.ts#L1)
- Server: [src/server.ts](src/server.ts#L1)
- Auth routes: [src/modules/auth/auth.route.ts](src/modules/auth/auth.route.ts#L1)
- Issues routes: [src/modules/issues/issues.route.ts](src/modules/issues/issues.route.ts#L1)
- Environment config: [src/config/index.ts](src/config/index.ts#L1)

If you want, I can add example curl requests or a Postman collection next. Let me know which you'd prefer.
