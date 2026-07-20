# Secure User Authentication System

A secure authentication system implementing multi-factor authentication, OAuth 2.0 federated login, and AES-256 data encryption — built as part of the Internee.pk internship program.

## Overview

This project strengthens user authentication and data security by combining three complementary security mechanisms:

- **Two-Factor Authentication (2FA)** via Time-based One-Time Passwords (TOTP), compatible with Google Authenticator
- **OAuth 2.0** federated login via Google, enabling secure sign-in without password exchange
- **AES-256 encryption** for sensitive user data at rest

## Features

| Feature | Implementation |
|---|---|
| Password security | Passwords hashed with bcrypt (salted, one-way) |
| Two-Factor Authentication | TOTP standard (RFC 6238) via `speakeasy`, QR-code enrollment via `qrcode` |
| OAuth 2.0 | Google OAuth login via Passport.js |
| Data encryption | AES-256-CBC encryption for stored email addresses via Node's native `crypto` module |
| Session management | Server-side sessions via `express-session` |

## Tech Stack

- **Backend:** Node.js, Express
- **Authentication:** Passport.js, Google OAuth 2.0, Speakeasy (TOTP)
- **Encryption:** Node.js `crypto` module (AES-256-CBC), bcryptjs (password hashing)
- **Data store:** JSON-based staging store (demo/testing purposes)
- **Test data:** Sample fake user dataset (`sample-data/MOCK_DATA.json`), generated in the style of Mockaroo

## Project Structure

```
secure-auth-system/
├── routes/
│   └── auth.js          # Registration, login, 2FA, OAuth routes
├── utils/
│   ├── encryption.js    # AES-256 encrypt/decrypt helpers
│   └── mockData.js      # User data store operations
├── public/
│   └── index.html       # Demo front-end (register/login/2FA UI)
├── sample-data/
│   └── MOCK_DATA.json   # Sample fake user dataset for testing
├── server.js            # Application entry point
├── package.json
└── .env.example          # Environment variable template
```

## Setup Instructions

### Prerequisites
- Node.js (LTS version)
- A free Google Cloud account (for OAuth credentials)

### Installation

```bash
npm install
cp .env.example .env
```

Update `.env` with your own `SESSION_SECRET`, `ENCRYPTION_KEY` (32 characters), and Google OAuth credentials.

### Google OAuth 2.0 Setup
1. Create a project at [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Create an **OAuth Client ID** (Web application type)
4. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
5. Copy the Client ID and Secret into `.env`

### Run the application

```bash
npm start
```

Visit `http://localhost:3000` to test registration, login, 2FA setup, and Google OAuth login.

## Security Design Notes

- Passwords are never stored in plaintext — bcrypt hashing with per-password salt
- Email addresses are encrypted using AES-256-CBC before being persisted
- 2FA secrets follow the TOTP standard, compatible with any standard authenticator app
- OAuth 2.0 flow ensures credentials are never shared with this application directly

## Author

Faraz Hussain — Internee.pk Internship Program