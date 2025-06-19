# 💼 Lendsqr Wallet Service - Backend API

This is a backend wallet service built with:

- Node.js (LTS)
- TypeScript
- Express
- Knex.js (ORM)
- MySQL
- Jest (for testing)

---

## 🚀 Getting Started

To get started with the Lendsqr Wallet Service, follow these steps:

### 🔁 Clone the repository

```bash
git clone https://github.com/yourusername/lendsqr-wallet-service.git
cd lendsqr-wallet-service


```

## Install dependencies

npm install

## Set up environment variables

Create a .env file using .env.example as a guide and configure the values.

## Run database migrations

npx knex migrate:latest

## Start the development server

npm start

## Project Folder Structure

src/
├── **tests**/
├── config/
├── controllers/
├── database/
│ ├── migrations/
│ └── seeds/
├── middlewares/
├── repositories/
├── routes/
├── utils/

## unning Tests

npm run test

ER Diagram
https://drawsql.app/teams/oluwagbenga/diagrams/lendsrq-wallet

### 🔍 Separation of Concerns

The application is organized using a layered architecture:

- **Controllers**: Handle HTTP requests and responses.
- **Repositories**: Encapsulate all database logic using Knex.js for flexibility and maintainability.
- **Middlewares**: Include faux authentication and potential error handling.
- **Utils**: Contains helper functions like integration with the Adjutor Karma API.

### 🔐 Faux Authentication

Since real authentication was not required, I implemented a simple middleware to simulate user identity via a token or request header.

### 🧾 Use of Transactions

For operations like transfers and withdrawals, transactions are handled using Knex’s `.transaction()` block to ensure data consistency, especially when updating multiple records.

### 🚫 Karma Blacklist Check

Before creating a user, a real-time check is done using the **Lendsqr Adjutor Karma API** to prevent blacklisted users from registering.

### 🧪 Testing

Unit tests were written using **Jest** to cover:

- Positive flows (e.g. wallet funding, transfers)
- Negative cases (e.g. blacklisted users, insufficient funds)

Coverage was prioritized on **controllers**, with plans to expand into **repositories** and **utils**.

### 💾 Database Design

The schema was designed with normalization in mind:

- **Users** are linked one-to-one with **wallets**
- **Transactions** log all fund movements, including transfer types
