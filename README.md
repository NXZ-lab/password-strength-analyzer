<<<<<<< Updated upstream
# password-strength-analyzer
cybersecurity projects
=======
# Password Strength Analyzer

<div align="center">

![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=061a23)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Security](https://img.shields.io/badge/Security-JWT%20%7C%20Argon2%20%7C%20HIBP-7c3aed?style=for-the-badge)

**A full-stack security-focused web app for analyzing password strength, detecting breaches, preventing password reuse, and helping users create stronger credentials.**

</div>

---

## Overview

Password Strength Analyzer is a modern full-stack application built to evaluate password quality in real time, surface actionable security feedback, and securely maintain password history without ever storing plaintext passwords.

It combines a polished React dashboard with a hardened Express API, MongoDB Atlas persistence, Argon2 hashing, JWT authentication, zxcvbn-powered scoring, and Have I Been Pwned breach detection using the K-Anonymity model.

---

## Highlights

- Real-time password strength analysis.
- Strength meter with Weak, Medium, and Strong labels.
- Detailed password checks for length, uppercase, lowercase, numbers, symbols, and entropy.
- Crack-time estimate using `zxcvbn-ts`.
- Detection of common password patterns and user-facing suggestions.
- Password generator with configurable options.
- Breach detection through Have I Been Pwned range API.
- Password history enforcement to block reuse of the last 10 passwords.
- Secure authentication with JWT.
- Argon2id password hashing.
- Helmet, CORS, rate limiting, and input validation built in.
- Docker support for local containerized development.
- Deployment-ready structure for Vercel and Render.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Password Hashing | Argon2id |
| Password Analysis | `@zxcvbn-ts/core` |
| Breach Detection | Have I Been Pwned API with K-Anonymity |
| Security | Helmet, Express Rate Limit, CORS, Express Validator |
| Deployment | Vercel, Render |
| Containerization | Docker, Docker Compose |

---

## Features

### Password Analysis

- Live strength calculation while typing.
- Score classification from weak to strong.
- Entropy estimation.
- Character diversity checks.
- Pattern detection and contextual suggestions.
- Offline crack time estimate display.

### Password Generator

- Adjustable password length.
- Optional uppercase letters.
- Optional lowercase letters.
- Optional numbers.
- Optional symbols.
- Cryptographically secure browser generation using `crypto.getRandomValues()`.

### Breach Detection

- Uses SHA-1 hashing locally.
- Sends only the first 5 hash characters to the HIBP range API.
- Never sends the full password to the breach service.
- Returns breach count when a password appears in known leaks.

### Password History Enforcement

- Stores only Argon2 hashes in MongoDB.
- Compares new passwords against the last 10 historical hashes.
- Prevents password reuse before storing a new entry.

### Authentication and Dashboard

- User registration.
- User login.
- JWT-based session flow.
- Dashboard cards for latest score, breach status, and reuse status.
- Secure protected routes on both frontend and backend.

---

## Project Structure

```text
password-strength-analyzer/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/password-strength-analyzer.git
cd password-strength-analyzer
```

### 2. Install dependencies

```bash
npm install
```

If needed, install workspace dependencies separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/password-strength-analyzer?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
HIBP_API_BASE_URL=https://api.pwnedpasswords.com/range
```

For Windows stability, it is also helpful to place the same `.env` file inside the `backend/` folder.

### 4. Start the application

From the project root:

```bash
npm run dev
```

Or run both apps separately:

**Backend**
```bash
cd backend
npm run dev
```

**Frontend**
```bash
cd frontend
npm run dev
```

### 5. Open the app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## API Endpoints

### Auth

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |

### Passwords

| Method | Route | Description |
|---|---|---|
| GET | `/api/passwords/dashboard` | Get latest dashboard summary |
| POST | `/api/passwords/breach-check` | Check password against HIBP |
| POST | `/api/passwords/analyze-and-store` | Store password hash after validation |

---

## Security Design

This project is designed around practical password safety principles:

- Plaintext passwords are never stored.
- User passwords are hashed with Argon2id.
- Password history is stored as Argon2id hashes.
- Password reuse is blocked against the most recent 10 entries.
- HIBP integration uses K-Anonymity to avoid sending complete passwords.
- JWT secures authenticated requests.
- Helmet adds secure HTTP headers.
- Rate limiting reduces abuse.
- Request payloads are validated using `express-validator`.
- Sensitive values are managed through environment variables.

---

## Docker

Run the full app with Docker Compose:

```bash
docker compose up --build
```

Default ports:

- Frontend: `4173`
- Backend: `5000`

---

## Deployment

### Frontend on Vercel

- Import the `frontend` directory as a Vercel project.
- Set `VITE_API_BASE_URL` to your deployed backend API URL, for example `https://your-render-service.onrender.com/api`.
- Build command:

```bash
npm install && npm run build
```

- Output directory: `dist`

### Backend on Render

- Create a Render Web Service from the `backend` directory.
- Build command:

```bash
npm install && npm run build
```

- Start command:

```bash
npm run start
```

- Add all required environment variables.
- Set `FRONTEND_URL` to the deployed Vercel domain.

---

## Recommended Improvements

For a more advanced production deployment, consider adding:

- Refresh tokens with secure HTTP-only cookies.
- Email verification.
- Password reset flow.
- Audit logs.
- Role-based access control.
- Unit, integration, and end-to-end tests.
- CI/CD workflow with GitHub Actions.
- Monitoring and centralized logging.

---

## Screens the App Includes

- Login page.
- Register page with live password analysis.
- Dashboard with score summary, breach status, and reuse protection.
- Password generator panel.
- Strength meter and password checklist.

---

## Why This Project Stands Out

This repository is more than a basic password checker. It demonstrates how to combine frontend usability, backend security, third-party breach intelligence, and secure password history controls into a single cohesive developer portfolio project.

It is a strong full-stack security project for GitHub, portfolios, internships, and production-style demos.

---

## License

This project is provided for educational and portfolio use. Update the license section to match your preferred open-source license before publishing.

---

<div align="center">

Built with security-first design, modern TypeScript tooling, and full-stack best practices.

</div>

>>>>>>> Stashed changes
