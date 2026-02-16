# To-Do List Application

This is a simple yet robust To-Do List application built with Node.js, Express, and MongoDB. It provides a RESTful API for managing tasks and user authentication.

## Features

- User authentication (registration, login, email verification).
- Create, read, update, and delete tasks.
- Associate tasks with specific users.
- Secure password hashing.
- JWT-based authentication for API access.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
- **Email Verification:** Nodemailer, Handlebars (for email templates)
- **Development Tools:** Docker, Docker Compose

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- Node.js (if running without Docker)
- MongoDB (if running without Docker)

### Running with Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd to-do-list
   ```
2. **Create a `.env` file:**
   Create a `.env` file in the root directory with the following variables. Replace placeholders with your actual values.
   ```
   MONGO_URI=mongodb://mongodb:27017/todoapp
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   BASE_URL=http://localhost:3000
   ```
   **Note:** For `MONGO_URI`, if running locally without Docker, it might be `mongodb://localhost:27017/todoapp`.
   `EMAIL_USER` and `EMAIL_PASS` are for Nodemailer to send verification emails. You might need to set up an app password if using services like Gmail.

3. **Build and run the Docker containers:**
   ```bash
   docker-compose up --build -d
   ```
   This will build the Docker image for the Node.js application and start both the application and MongoDB containers.

4. **Access the application:**
   The API will be running on `http://localhost:3000`.

### Running Locally (without Docker)

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd to-do-list
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file:**
   Create a `.env` file in the root directory with the same variables as above, adjusting `MONGO_URI` if necessary (e.g., `mongodb://localhost:27017/todoapp`).

4. **Start the MongoDB server:**
   Ensure your local MongoDB instance is running.

5. **Start the application:**
   ```bash
   npm start
   ```
   The API will be running on `http://localhost:3000`.

## API Routes

### User Authentication

- **POST /api/register**
  - Registers a new user.
  - Body: `{ "username": "...", "email": "...", "password": "..." }`
- **POST /api/login**
  - Logs in a user and returns a JWT token.
  - Body: `{ "email": "...", "password": "..." }`
- **GET /api/verify-email/:token**
  - Verifies user's email using a token sent to their email.

### Tasks

All task routes require a valid JWT token in the `Authorization` header (e.g., `Bearer YOUR_JWT_TOKEN`).

- **GET /api/tasks**
  - Get all tasks for the authenticated user.
- **GET /api/tasks/:id**
  - Get a single task by ID.
- **POST /api/tasks**
  - Create a new task.
  - Body: `{ "title": "...", "description": "...", "completed": false }`
- **PUT /api/tasks/:id**
  - Update an existing task.
  - Body: `{ "title": "...", "description": "...", "completed": true }` (fields are optional)
- **DELETE /api/tasks/:id**
  - Delete a task.

## Project Structure

```
.
├── .dockerignore
├── app.js                   # Main application file
├── compose.yml              # Docker Compose configuration
├── Dockerfile               # Dockerfile for the Node.js app
├── package.json             # Project dependencies and scripts
├── README.md                # This file
├── controllers/
│   └── userControllers.js   # User-related business logic
├── db/
│   └── connect.js           # Database connection
├── emailVerify/
│   ├── template.hbs         # Email verification template
│   └── verifyMall.js        # Email verification utility
├── models/
│   └── userModel.js         # User schema
│   └── taskModel.js         # Task schema (needs to be created if not exists)
└── routes/
    ├── tasks.js             # Task-related API routes
    └── userRout.js          # User authentication API routes
```
**Note**: If `taskModel.js` doesn't exist, it should be created for task management.