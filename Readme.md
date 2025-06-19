# Lendsqr Wallet Service - Backend API

- Node.js (LTS)
- TypeScript
- Express
- Knex.js (ORM)
- MySQL
- Jest (for testing)

Getting Started

To get started with the lendsqr wallet service follow these steps

# Clone repo

- git clone https://github.com/yourusername/lendsqr-wallet-.git
  cd lendsqr-wallet-service

# Install dependencies

- npm install

# Setup environment

- configure the environment from the env

# Run migrations

- npx knex migrate:latest

# Start the server

- npm start

Project Folder Structure

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

## RUNNING TEST

npm run test

## ER DIAGRAM LINK

https://drawsql.app/teams/oluwagbenga/diagrams/lendsrq-wallet
