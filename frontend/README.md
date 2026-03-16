# Worklify - Frontend

Worklify is a modern task management application designed to streamline project workflows for both administrators and users. This repository contains the frontend implementation built with React and Vite.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/) & [React Toastify](https://fkhadra.github.io/react-toastify/introduction)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [Moment.js](https://momentjs.com/)

## ✨ Key Features

- **Authentication**: Secure Login and Signup flows.
- **Admin Dashboard**:
  - Manage users and tasks.
  - Create new tasks and assign them.
  - View overall project statistics with interactive charts.
- **User Dashboard**:
  - View assigned tasks and their details.
  - Track personal task progress.
- **Responsive Design**: Optimized for various screen sizes using Tailwind CSS.
- **Real-time Feedback**: Toast notifications for successful actions or errors.

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── assets/          # Static assets (images, logos, etc.)
│   ├── component/       # Reusable UI components
│   ├── context/         # React Context for state management
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page-level components
│   │   ├── Admin/       # Admin-specific pages (Dashboard, Manage Users, etc.)
│   │   ├── Auth/        # Authentication pages (Login, Signup)
│   │   └── User/        # User-specific pages (My Tasks, View Details)
│   ├── routes/          # Navigation and route definitions
│   ├── utils/           # Utility functions and Axios instances
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Publicly accessible assets
└── vite.config.js       # Vite configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository.
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the source code using ESLint.
- `npm run preview`: Previews the production build locally.

---

Built with ❤️ by the Worklify team.
