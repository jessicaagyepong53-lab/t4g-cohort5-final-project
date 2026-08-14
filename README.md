# AFRA Connect — Backend API

**A reproductive health platform built for Tech4Girls Cohort 5.**

AFRA Connect exists to make reproductive health information and self-tracking accessible and private for young women. Many of the people it's built for don't have easy, judgement-free access to a clinic or a pharmacist who will explain how a test kit works, or a simple place to keep track of their own birth control schedule and test results without that information living in someone else's notebook or a shared family phone. AFRA Connect gives them a portal of their own and gives the organisation running it a way to manage the products and test kits it makes available, and see who's using the platform, without wading through spreadsheets.

This repository is the backend: a REST API built with FastAPI, SQLAlchemy, and MySQL that powers both sides of the platform.

---

## Who uses this

AFRA Connect has two audiences, and the API is shaped around both of them:

- **Users** — people using the platform to register test kits they own, log test results, and manage their birth control information. Everything a user creates is scoped to their own account only.
- **Management** — the team running AFRA Connect. They maintain the catalogue of test kits available on the platform (what they are, how to use them, who makes them) and can see the users registered on the system.

A single `users` table holds both, distinguished by a `role` field (`user` or `management`), rather than two separate login systems — this keeps authentication simple while still letting the two portals behave completely differently once someone is logged in.

---

## How the data fits together

```
users (1) ──────< (many) test_results
users (1) ──────< (many) test_kits          [added_by: management users only]
users (1) ──────< (many) user_test_kits     [personal kit registrations]
```

- **`users`** — every account on the platform, management or regular user. Passwords are hashed with bcrypt and never returned by the API.
- **`test_results`** — a user's own recorded test outcomes. Only visible in relation to the user who owns them.
- **`test_kits`** — the shared catalogue of test kits AFRA Connect supports (e.g. "Pregnancy Test Kit", manufacturer, usage instructions). Added and maintained by management.
- **`user_test_kits`** — separate from the catalogue on purpose: this is a user registering the *specific physical kit they bought* (serial number, purchase/expiry date, notes), not adding to the shared catalogue. Two different concepts that happen to share the word "test kit."

---

## Tech stack

- **FastAPI** — the API framework
- **SQLAlchemy** — ORM (no raw SQL queries)
- **MySQL** — the database
- **Pydantic** — request/response validation
- **Passlib (bcrypt)** — password hashing
- **python-dotenv** — environment variable management

The codebase is split into layers on purpose: **routes** handle HTTP concerns (status codes, request/response shape), **repositories** handle all database queries, and **schemas** define what data is allowed in and out. Route handlers never touch SQLAlchemy directly that all lives in the repository layer, which makes the API easier to test and to extend later (e.g. swapping storage without rewriting every endpoint).

---

## Project structure

```
backend/
├── app/
│   ├── database/
│   │   └── connection.py      # engine, session, get_db()
│   ├── models/                # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── test_result.py
│   │   ├── test_kit.py
│   │   └── user_test_kit.py
│   ├── schemas/                # Pydantic request/response schemas
│   │   ├── user.py
│   │   ├── auth.py
│   │   ├── test_result.py
│   │   ├── test_kit.py
│   │   └── user_test_kit.py
│   ├── repositories/           # all database queries live here
│   │   ├── user_repository.py
│   │   ├── test_result_repository.py
│   │   ├── test_kit_repository.py
│   │   └── user_test_kit_repository.py
│   └── routes/                 # HTTP endpoints
│       ├── users.py
│       ├── test_results.py
│       ├── test_kits.py
│       └── user_test_kits.py
├── main.py                     # app entrypoint, router registration
├── requirements.txt
├── .env                        
└── .gitignore
```

---

## API Reference

### Users & Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/` | Create a new account |
| POST | `/users/login` | Log in with email + password |
| GET | `/users/` | List all users |
| GET | `/users/{id}` | Get one user |
| PUT | `/users/{id}` | Update a user |
| DELETE | `/users/{id}` | Delete a user |

### Test Results

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/test-results/` | Record a test result |
| GET | `/test-results/` | List all test results |
| GET | `/test-results/user/{user_id}` | Get a specific user's results |
| GET | `/test-results/{id}` | Get one test result |
| PUT | `/test-results/{id}` | Update a test result |
| DELETE | `/test-results/{id}` | Delete a test result |

### Test Kits (management-maintained catalogue)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/test-kits/` | Add a kit to the catalogue |
| GET | `/test-kits/` | List the catalogue |
| GET | `/test-kits/{id}` | Get one catalogue kit |
| PUT | `/test-kits/{id}` | Update a catalogue kit |
| DELETE | `/test-kits/{id}` | Remove a catalogue kit |

### User Test Kits (personal registrations)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user-test-kits/` | Register a kit a user owns |
| GET | `/user-test-kits/` | List all registered kits |
| GET | `/user-test-kits/user/{user_id}` | Get a specific user's registered kits |
| GET | `/user-test-kits/{id}` | Get one registered kit |
| PUT | `/user-test-kits/{id}` | Update a registered kit |
| DELETE | `/user-test-kits/{id}` | Remove a registered kit |

All endpoints return proper HTTP status codes (`201` on create, `204` on delete, `404` when a record doesn't exist, `409` on duplicate email, `401` on failed login) and validate input via Pydantic bad or missing data returns a clear error instead of crashing the server.

---

## Error handling

Every write operation checks that related records actually exist before touching the database for example, you can't create a test result for a `user_id` that doesn't exist, and you'll get a `404` with a clear message instead of a broken foreign key or a silent failure. Duplicate email signups are caught and return `409 Conflict` rather than a raw database error.

---

## Frontend

This backend powers a full HTML/CSS/JavaScript frontend (`pages/`) with separate portals for management and users, connected via `fetch()` calls in `pages/src/script.js`. See the frontend for the actual UI these endpoints serve.

---

## About this project

Built as the final project for **Tech4Girls Backend Development, Cohort 5** (August 2026), demonstrating a full REST API with FastAPI, SQLAlchemy, and MySQL, including full CRUD, a repository layer separated from route handlers, environment-based configuration, and proper error handling throughout.
