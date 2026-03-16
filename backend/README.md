# Worklify - Backend

Worklify's backend is a robust RESTful API built with Node.js and Express, providing the core logic, data management, and security for the task management application.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **File Uploads**: [Multer](https://github.com/expressjs/multer)
- **File Export**: [ExcelJS](https://github.com/exceljs/exceljs)
- **Middleware**: [Cookie-parser](https://github.com/expressjs/cookie-parser), [CORS](https://github.com/expressjs/cors), [Dotenv](https://github.com/motdotla/dotenv)
- **Dev Tool**: [Nodemon](https://nodemon.io/)

## ✨ Key API Features

- **User Authentication**: Secure signup and login with hashed passwords and cookie-based JWT sessions.
- **Task Management**: Full CRUD (Create, Read, Update, Delete) operations for tasks.
- **Role-Based Access Control**: Different permissions for Admins and regular Users.
- **Reporting**: Export task and user reports to Excel files using ExcelJS.
- **User Management**: Admin capabilities to manage user accounts and roles.
- **File Handling**: Support for uploading task-related files or profile adjustments.

## 📂 Project Structure

```text
backend/
├── controller/      # Request handlers and business logic
│   ├── Authcontroller.js
│   ├── Reportcontroller.js
│   ├── Taskcontroller.js
│   └── Usercontroller.js
├── models/          # Mongoose schemas and data models
│   ├── Task.js
│   └── User.js
├── routes/          # API route definitions
│   ├── Authroute.js
│   ├── Reportroute.js
│   ├── Taskroute.js
│   └── Userroute.js
├── middleware/      # Custom Express middleware (Auth, Error handling)
├── utils/           # Utility functions
├── uploads/         # Temporary directory for file uploads
├── index.js         # Server entry point
└── .env             # Environment variables (Sensitive!)
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS)
- MongoDB (Local or Atlas instance)

### Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### Available Scripts

- `npm run dev`: Starts the server with `nodemon` for development.
- `npm start`: Starts the server using standard `node`.
- `npm run build`: Placeholder for build tasks.

---

Built with ❤️ by the Worklify team.
