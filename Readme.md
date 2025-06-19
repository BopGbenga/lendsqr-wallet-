# Lendsqr Wallet Service – Backend API

This is a backend wallet service built as part of a technical assessment, simulating core digital wallet functionalities such as user registration, authentication, funding, withdrawal, transfer, and transaction history.

---

### Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **Knex.js** (SQL Query Builder)
- **MySQL**
- **Jest** (Unit Testing)

---

## 🚀 Getting Started

### 🔁 Clone the Repository

```bash
git clone https://github.com/yourusername/lendsqr-wallet-service.git
cd lendsqr-wallet-service
```

### 📦 Install Dependencies

```bash
npm install
```

### ⚙️ Set Up Environment Variables

Create a `.env` file using `.env.example` as a reference and fill in the required values

### 🧱 Run Migrations

```bash
npx knex migrate:latest
```

### ▶️ Start Development Server

```bash
npm run dev
```

---

## 🗂️ Project Structure

```
├── config/
├── controllers/
├── database/
├── data/
├── middlewares/
├── repositories/
├── routes/
├── tests/
├── utils/
```

---

## Architecture Overview

### Entry Points

- **`app.ts`**: Configures the app by registering routes, middlewares, and global error handlers. Exports the app instance.
- **`server.ts`**: Starts the Express server, connects to the database, and listens on the specified port.

---

## ✅ Validation Middlewares

The app uses **Joi** for schema validation.

- `validateUser`: Ensures name, email, password, and BVN are present and valid during registration.
- `validateLogin`: Validates email and password for login.

If validation fails, a structured error response (`422 Unprocessable Entity`) is returned.

---

## 🔒 Authentication

A **faux JWT-based middleware** is used to simulate authentication by extracting and verifying a token in the `Authorization` header.

---

## 🚫 Karma Blacklist Integration

Before user creation, the BVN is checked against the **Lendsqr Adjutor Karma API**.

Since real access was not provided, the integration uses:

- A simulated `fetch` call to a local endpoint.
- Fallback to mock data stored in `src/data/ajutor_users.json`.

This ensures the blacklist logic works and is testable.

---

## Repository Pattern

### User Repository

- `createUser(data)`
- `findUserByEmail(email)`
- `findUserById(id)`

### Wallet Repository

- `createWallet({ user_id, balance })`
- `fundWalletByUserId(user_id)`
- `updateWalletBalance(user_id, amount)`
- `transferFunds(sender_id, recipient_id, amount)`
- `withdrawFunds(user_id, amount)`

### 💳 Transaction Repository

- `createTransaction(data)`
- `getUserTransactions(user_id)`

Records all transaction types (`FUND`, `WITHDRAW`, `TRANSFER`) with appropriate status and timestamps.

---

## 🌐 API Routes

### **User Routes** (`/users`)

- `POST /register`: Register a new user
- `POST /login`: Log in and receive a token

### **Wallet Routes** (`/wallet`)

- `POST /fund`: Fund your wallet
- `POST /transfer`: Transfer funds to another user
- `POST /withdraw`: Withdraw from your wallet
- `GET /balance`: View current wallet balance

### **Transaction Routes** (`/transactions`)

- `GET /:user_id`: Fetch all user's transactions

---

## 🧪 Testing

Run all unit tests using:

```bash
npm run test
```

Tests cover:

- User registration & login
- Wallet funding, transfer, and withdrawal
- Edge cases (e.g., blacklisted users, insufficient balance)

---

## 🧾 ER Diagram

You can view the database schema here:
[Lendsqr Wallet Schema on DrawSQL](https://drawsql.app/teams/oluwagbenga/diagrams/lendsrq-wallet)

## 📁 Data Folder

The `/data` folder contains mocked data used when Karma API fallback is triggered.
This ensures your service remains functional and testable in offline mode.
