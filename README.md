# 💰 Finance Management API

A `RESTful` backend API for managing financial transactions, built with `Node.js`, `Express.js`, and `PostgreSQL`. The application provides endpoints to **create**, **retrieve**, **update**, **delete**, filter, and summarize income and expense records stored in a relational database.

The backend follows the **Model-View-Controller (MVC)** architectural pattern to separate database access, HTTP request-response handling, and the frontend presentation layer.

A lightweight `HTML`, `CSS`, and `JavaScript` frontend was developed as the **View/API consumer** to demonstrate end-to-end integration between the client, server, and database layers.

The project also includes automated **unit and integration testing** using `Vitest` and `Supertest`, API rate limiting, dependency vulnerability scanning, and `CodeQL` static security analysis through `GitHub Actions CI`.

This project was built to strengthen practical full-stack and backend development skills, including `REST API` design, MVC architecture, relational database modeling, `SQL` query development, middleware, automated testing, security practices, and integrating `Node.js` applications with `PostgreSQL`.

## 📷 Application Preview

Frontend: https://finance-management-api-frontend.onrender.com

Backend API: https://finance-management-api-pmni.onrender.com

> **Note:** This project uses Render's free-tier hosting. Backend services and the database may be temporarily unavailable, which can affect the live demo.

![Finance Management Application](./assets/finance-management-preview.png)

## 🛠️ Technologies Used

**Backend:** `Node.js`, `Express.js`, `PostgreSQL`, `SQL`, `pg` (Node PostgreSQL client), `dotenv`, `CORS`, `express-rate-limit`

**Architecture:** `Model-View-Controller (MVC)`

**Testing:** `Vitest`, `Supertest`

**DevSecOps & CI:** `GitHub Actions`, `npm audit`, `CodeQL`

**Deployment:** `Render`

**Development Tools:** `Postman`, `pgAdmin`, `Nodemon`, `Visual Studio Code`

**Frontend (View/API Consumer):** `HTML`, `CSS`, `JavaScript`, `Fetch API`

## 🏗️ MVC Architecture

The application follows the **Model-View-Controller (MVC)** architectural pattern to separate responsibilities and improve maintainability.

```text
View / Frontend
      ↓
Fetch API
      ↓
Express Routes
      ↓
Middleware
      ↓
Controllers
      ↓
Models
      ↓
PostgreSQL
```

### Model

The `models/` layer handles database access and SQL operations.

- `categoryModel.js` retrieves category data.
- `transactionModel.js` handles transaction retrieval, filtering, CRUD operations, and financial summary queries.
- Database queries use the PostgreSQL connection pool provided by `db.js`.
- Parameterized SQL queries are used when request values are included in queries.

### View

The `frontend/` directory acts as the presentation layer and API consumer.

- `index.html` provides the application interface.
- `style.css` handles presentation and responsive styling.
- `script.js` communicates with the backend through the `Fetch API` and dynamically updates the DOM.

### Controller

The `controllers/` layer handles HTTP request-response logic.

Controllers:

- Read data from `req.params`, `req.query`, and `req.body`
- Call the appropriate model functions
- Handle application outcomes such as resources not being found
- Return appropriate HTTP status codes and JSON responses

### Routes and Middleware

Express routes map API endpoints to the appropriate controller functions.

Middleware provides reusable request-processing logic before controllers execute, including:

- Transaction validation
- API rate limiting
- JSON request-body parsing
- CORS handling

This separation produces the following request-response flow:

```text
HTTP Request
    ↓
Route
    ↓
Middleware
    ↓
Controller
    ↓
Model
    ↓
PostgreSQL
    ↓
Model
    ↓
Controller
    ↓
JSON Response
```

## ⚙️ Installation & Setup

**1. Clone the repository**

```bash
git clone https://github.com/your-username/finance-management-api.git
cd finance-management-api
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/finance_db
```

**4. Set up the PostgreSQL database**

Execute the SQL statements in `database/schema.sql` using **pgAdmin Query Tool** or `psql` to create the database schema and insert the initial category data.

**5. Start the backend server**

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

**6. Launch the frontend**

Open `frontend/index.html` using a local development server such as `VS Code Live Server` while the backend server is running.

## ✨ Backend Features

### RESTful API Development

- Designed `RESTful` endpoints following standard `HTTP` conventions
- Implemented resource-based routing for transactions and categories
- Separated routes, controllers, models, and middleware using MVC architecture

### CRUD Operations

- `Create` new financial transactions
- `Retrieve` individual or multiple transactions
- `Update` existing transaction records
- `Delete` transactions from the database

### Dynamic Filtering

Supports query parameter filtering:

- Filter by transaction type
- Filter by category
- Combine multiple filters within a single request

A single endpoint dynamically constructs the required SQL conditions instead of maintaining separate queries or routes for each filter combination.

### Database Integration

- Connected `Node.js` to `PostgreSQL` using connection pooling
- Separated SQL/database access into the model layer
- Used parameterized `SQL` queries when incorporating request values to protect against SQL injection
- Implemented relational database design using foreign key constraints

### Middleware Validation

- Validated incoming request bodies before controller execution
- Reused the same validation middleware for create and update operations
- Enforced business rules including:
  - Required fields
  - Positive transaction amounts
  - Valid transaction types
  - Transaction dates cannot be in the future

### API Rate Limiting

- Applied rate limiting to `/api` endpoints using `express-rate-limit`
- Limits clients to 100 API requests within a 15-minute window by default
- Returns HTTP `429 Too Many Requests` when the limit is exceeded

### Financial Summary Endpoint

- Aggregated transaction data using PostgreSQL `SUM`, `CASE`, and `COALESCE`
- Calculated:
  - Total income
  - Total expenses
  - Overall balance

## 📌 API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/categories` | Retrieve all categories |
| GET | `/api/transactions` | Retrieve all transactions |
| GET | `/api/transactions/:id` | Retrieve a transaction by ID |
| GET | `/api/transactions/summary` | Retrieve income, expense, and balance summary |
| POST | `/api/transactions` | Create a new transaction |
| PUT | `/api/transactions/:id` | Update an existing transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Filtering Examples

```text
GET /api/transactions?type=expense
GET /api/transactions?category=Food
GET /api/transactions?type=expense&category=Food
```

## 🗄️ Database Schema

The application uses a relational `PostgreSQL` database consisting of two tables:

| Table | Purpose |
| ----- | ------- |
| `categories` | Stores predefined transaction categories such as Food, Salary, and Bills |
| `transactions` | Stores income and expense records linked to categories |

### Relationship

```text
categories (1) ───────< (many) transactions
```

- `transactions.category_id` references `categories.id`
- Database constraints including `NOT NULL`, `CHECK`, and `FOREIGN KEY` help maintain data integrity
- `ON DELETE RESTRICT` prevents deletion of categories associated with existing transactions

> Detailed database creation scripts and seed data are available in `database/schema.sql`.

## 🧪 Automated Testing

The backend includes automated tests using `Vitest` and `Supertest`.

### Unit Testing

Validation middleware is tested independently using mocked Express request, response, and `next` functions.

Tests cover:

- Valid transaction data
- Missing required fields
- Invalid transaction amounts
- Invalid transaction types
- Future transaction dates

### Integration Testing

Integration tests use `Supertest` to exercise the Express application through its API endpoints and connect to a dedicated PostgreSQL test database.

The tests cover:

- Category retrieval
- Transaction retrieval
- Filtering by type
- Filtering by category
- Combined filtering
- Retrieving transactions by ID
- Creating transactions
- Updating transactions
- Deleting transactions
- `404 Not Found` scenarios
- Invalid transaction requests
- Financial summary calculations
- Empty-database summary behavior

Database mutation tests also query the test database directly to verify that create, update, and delete operations actually modify persisted data.

### Rate Limiter Testing

The rate limiter is tested using a temporary Express application with a reduced request limit to verify that requests exceeding the configured threshold receive HTTP `429`.

The current automated test suite contains **23 tests** across unit, middleware, and integration testing.

## 🔒 CI & DevSecOps

`GitHub Actions` automatically performs testing and security checks on pushes to configured branches and pull requests targeting `main`.

### Automated Test & Dependency Scan

The CI workflow:

1. Starts a `PostgreSQL 16` service database
2. Configures the test database environment
3. Installs project dependencies using `npm ci`
4. Runs `npm audit --audit-level=high` to detect high-severity dependency vulnerabilities
5. Creates the test database schema
6. Runs the automated `Vitest` test suite

### CodeQL Static Analysis

A separate CI job uses `GitHub CodeQL` to perform static security analysis on the JavaScript source code.

This provides multiple automated checks before deployment:

```text
Code Push / Pull Request
          ↓
     GitHub Actions
          ↓
 ┌─────────────────────────────┐
 │ Automated Tests            │
 │ Dependency Vulnerability   │
 │ Scan                       │
 │ CodeQL Static Analysis     │
 └─────────────────────────────┘
          ↓
   Required checks pass
          ↓
        Render
```

Render deployment is configured to proceed only after the required CI checks pass.

## 🧠 Challenges & Solutions

**1. Dynamic SQL Filtering with Multiple Query Parameters**

- **Challenge:** Support filtering transactions by type, category, both filters together, or no filters without writing separate SQL queries for each scenario.
- **Solution:** Constructed SQL queries dynamically using condition arrays and parameterized placeholders, resulting in a flexible and maintainable filtering implementation while safely incorporating request values.

**2. Refactoring the Backend to MVC Architecture**

- **Challenge:** Controllers initially handled both HTTP request-response logic and direct database queries, combining multiple responsibilities in the same layer.
- **Solution:** Refactored database access and SQL operations into dedicated model modules while keeping request handling, HTTP status codes, and responses in controllers. This created clearer separation of concerns between the Model, View, and Controller layers.

**3. Understanding End-to-End Request–Response Flow**

- **Challenge:** Understanding how data moves between the frontend, `Express` server, `PostgreSQL` database, and back to the browser during CRUD operations.
- **Solution:** Traced and documented the complete lifecycle from `Fetch API` requests through Express routes, middleware, controllers, models, PostgreSQL queries, JSON responses, and DOM updates.

**4. Avoiding Duplicated Validation Logic**

- **Challenge:** Both transaction creation and update operations required identical validation rules, leading to potential code duplication.
- **Solution:** Extracted validation logic into reusable Express middleware, improving maintainability and separation of concerns.

**5. Handling Date Consistency Between PostgreSQL and the Browser**

- **Challenge:** PostgreSQL `DATE` values could be represented as JavaScript date/timestamp values when processed through the database client, leading to unwanted date representation in the frontend.
- **Solution:** Formatted dates directly in SQL using `TO_CHAR(..., 'YYYY-MM-DD')` for transaction retrieval and updates to provide a consistent date string to the frontend.

**6. Implementing CRUD Operations with Express and PostgreSQL**

- **Challenge:** Designing RESTful endpoints that correctly performed create, read, update, and delete operations while returning meaningful HTTP status codes and responses.
- **Solution:** Implemented route-controller-model separation, parameterized SQL queries, error handling, and appropriate HTTP response codes to build a maintainable API.

**7. Integrating the Frontend with the Backend API**

- **Challenge:** Connecting a JavaScript frontend to a Node.js backend while ensuring data was correctly exchanged between the client and server.
- **Solution:** Used the `Fetch API` to send HTTP requests, process JSON responses, handle errors, and dynamically update the user interface after CRUD operations.

**8. Building Reliable Automated Integration Tests**

- **Challenge:** Testing API operations that modify persistent database state while keeping individual tests predictable.
- **Solution:** Used a dedicated PostgreSQL test database, reset transaction data before integration tests, seeded known records, and directly verified database state after create, update, and delete operations.

## 📚 Learning Outcomes

- Designing `RESTful APIs` using `Express.js`
- Applying the `Model-View-Controller (MVC)` architectural pattern
- Separating routes, controllers, models, middleware, and database responsibilities
- Connecting backend applications to `PostgreSQL`
- Writing SQL queries involving filtering, joins, aggregation, and constraints
- Implementing CRUD operations using parameterized queries
- Applying middleware-based validation and API rate limiting
- Managing application configuration using environment variables
- Writing automated unit and integration tests using `Vitest` and `Supertest`
- Testing APIs against a dedicated PostgreSQL test database
- Integrating frontend clients with backend services through HTTP requests
- Implementing CI workflows with `GitHub Actions`
- Applying DevSecOps practices through dependency vulnerability scanning and `CodeQL` static analysis
- Deploying frontend and backend services to `Render`

## 💡 Future Improvements

- Add authentication and authorization for multi-user support
- Introduce pagination and sorting for larger transaction datasets
- Add additional filtering and reporting capabilities
- Introduce `Docker` for reproducible development and deployment environments
- Expand automated testing as additional application features are introduced
