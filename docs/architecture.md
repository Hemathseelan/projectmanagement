# TaskFlow — Architecture

## Overview

TaskFlow is a full-stack project management application split into two independently deployable applications: a React SPA (`frontend/`) and a REST API (`backend/`), talking to a MySQL database through Sequelize.

```
React (Vite)  →  Axios service layer  →  Express REST API  →  Sequelize ORM  →  MySQL
```

## Backend layering

The backend follows a strict layered architecture so that no layer reaches past its neighbor:

```
Route            defines the endpoint + attaches middleware
  → Middleware   auth, validation, rate limiting
    → Controller thin: parses req, calls a service, shapes the response
      → Service  all business logic, ownership checks, data shaping
        → Model  Sequelize models, DB schema and associations
```

Controllers never talk to models directly, and services never touch `req`/`res`. This keeps business logic unit-testable independent of Express, and keeps controllers replaceable if the transport layer ever changes (e.g. adding a GraphQL layer next to REST).

### Why services own ownership checks

Authorization ("does this task belong to a project owned by this user?") is business logic, not routing logic, so it lives in `services/*.js` rather than in middleware. Every read/update/delete on a `Project` or `Task` re-derives ownership from `req.user.id` (set by `authMiddleware` from the verified JWT) — the client-supplied `user_id` is never trusted.

## Frontend layering

```
Page             composes components, owns page-level state via hooks
  → Redux slice  async thunks + reducers, one slice per domain
    → Service    a thin Axios wrapper, one file per resource
      → api.js   the shared Axios instance (base URL, auth header, 401 handling)
```

Components never import Axios directly — all network access goes through `services/`, and all shared/async state lives in Redux Toolkit slices so page components stay focused on layout and interaction.

## Data model

```
User (1) ──< (N) Project (1) ──< (N) Task
```

- Deleting a user cascades to their projects (DB-level `ON DELETE CASCADE`).
- Deleting a project cascades to its tasks, wrapped in a Sequelize transaction in `projectService.deleteProject` so partial deletes can't happen.

## Security model

- Passwords are hashed with bcrypt (12 salt rounds) before storage; the hash is never returned in any API response (`User.toSafeJSON()`).
- Authentication is stateless JWT (`Authorization: Bearer <token>`), verified in `authMiddleware` on every protected route.
- Authorization is enforced per-request in the service layer by scoping every query with `user_id` (for projects) or a join through the owning project (for tasks) — never by trusting a client-supplied id.
- Input is validated twice: client-side for UX, and independently server-side with `express-validator`, since the client can never be trusted.
- `express-rate-limit` throttles `/api/auth/*` to 10 requests per 15 minutes per IP, and all of `/api` to a higher general ceiling.
- Sorting is restricted to an allow-list of columns (`SORTABLE_FIELDS`) so user input never reaches a raw `ORDER BY`.

## Request/response contract

Every API response follows the same envelope (see `docs/API.md`), so the frontend has one predictable shape to unwrap regardless of endpoint.
