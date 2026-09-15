# TaskFlow API Reference

Base URL: `http://localhost:5000/api`

All responses use this envelope:

```json
{ "success": true, "message": "...", "data": {} }
```

```json
{ "success": false, "message": "...", "errors": [ { "field": "email", "message": "Enter a valid email address" } ] }
```

Paginated list endpoints also return a `meta` object:

```json
{ "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
```

Protected routes require `Authorization: Bearer <token>`.

---

## Auth

### POST /api/auth/register
Rate limited (10 / 15 min / IP).

Body:
```json
{ "fullName": "Jane Doe", "email": "jane@example.com", "password": "SecurePass123" }
```
`201` → `{ user, token }` · `409` if email already exists · `422` on validation failure.

### POST /api/auth/login
Rate limited (10 / 15 min / IP).

Body: `{ "email": "...", "password": "..." }`
`200` → `{ user, token }` · `401` on invalid credentials.

### POST /api/auth/logout
Auth required. Stateless (client discards the token). `200`.

### GET /api/auth/profile
Auth required. Returns the current user. `200` · `404` if the account no longer exists.

---

## Projects
All routes below require `Authorization: Bearer <token>` and are scoped to the authenticated user only.

### GET /api/projects
Query params: `search`, `status`, `page`, `limit`, `sortBy` (`createdAt|name|status|startDate|endDate`), `order` (`asc|desc`).

### GET /api/projects/:id
`404` if the project doesn't exist or isn't owned by the caller.

### POST /api/projects
Body: `{ "name", "description", "status", "startDate", "endDate" }`. `status` must be one of `Not Started | In Progress | Completed`. `endDate` cannot precede `startDate`. `201`.

### PUT /api/projects/:id
Same body shape as create, all fields optional. `404` if not owned.

### DELETE /api/projects/:id
Cascades to the project's tasks. `404` if not owned.

---

## Tasks
All routes require auth and are scoped through the owning project.

### GET /api/tasks
Query params: `search`, `status`, `priority`, `projectId`, `page`, `limit`, `sortBy` (`createdAt|name|dueDate|priority|status`), `order`.

### GET /api/tasks/:id
### POST /api/tasks
Body: `{ "projectId", "name", "description", "priority", "status", "dueDate" }`. `projectId` must belong to the caller or the request is rejected with `404`.

### PUT /api/tasks/:id
### DELETE /api/tasks/:id

---

## Dashboard

### GET /api/dashboard
Returns statistics scoped to the authenticated user only:
```json
{ "totalProjects": 4, "totalTasks": 12, "completedTasks": 5, "pendingTasks": 4, "projectsInProgress": 2 }
```

---

## Status codes used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request (e.g. invalid FK reference) |
| 401 | Missing / invalid / expired token, or bad credentials |
| 403 | Reserved for future role-based checks |
| 404 | Not found or not owned by the caller |
| 409 | Conflict (duplicate email) |
| 422 | Validation failed |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |
