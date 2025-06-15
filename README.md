# TechFin Backend

A simple yet robust system for managing financial transactions, built with TypeScript and Next.js.

## Why This Approach?

Chose Next.js for its API routes and future frontend capabilities and SSR. Also, helps to keep both frontend and backend on the same domain enahancing security good for security centric industries like FinTech.

### Key Features

1. **Secure Authentication**

   - JWT-based auth with cookies for easy frontend integration
   - No need to maintain session on server side
   - Protected routes using edge middleware
   - (For production, I'd switch to Auth0)

2. **Clean Architecture**

   - Factory pattern + Dependency Injection for flexibility
   - Easy to switch from in-memory to real database
   - Clear separation between business logic and data access

3. **Data Safety**

   - Version-based updates to prevent data conflicts
   - Soft delete to keep transaction history
   - Each user's data is strictly isolated

4. **Performance**
   - Efficient in-memory storage for current needs
   - Pagination and filtering for large datasets
   - Ready for database integration when needed

### Out of scope for this project

- Input validations
- Caching
- Error monitoring
- Frontend UI
- Prod DB implementations

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Set up environment:

```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

3. Run in production mode:

```bash
npm run build
npm start
```

**Note: Use production mode as Next.js dev mode might reset in-memory storage between requests.**

## API Examples

1. Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

2. Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

3. Create Transaction:

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "payee": "Grocery Store",
    "amount": 50.00,
    "category": "Food",
    "date": "2024-03-20"
  }'
```

## Project Structure

```
src/
├── api/              # Backend logic
│   ├── services/    # Business logic
│   ├── repositories/# Data access
│   └── utils/       # Shared utilities
└── app/
    └── api/         # API routes
```
