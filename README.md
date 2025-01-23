# Task Management System

A modern, intuitive task management application built with Next.js, featuring a sleek user interface and powerful task organization capabilities.

## 🚀 Features

- **User Authentication**
  - Secure login and registration
  - Protected routes and sessions
  - Password encryption

- **Task Management**
  - Create, edit, and delete tasks
  - Set task priorities and deadlines
  - Track task status (pending, in progress, completed)
  - Real-time updates

- **Dashboard**
  - Overview of task statistics
  - Recent tasks view
  - Performance metrics
  - Intuitive navigation

- **Modern UI/UX**
  - Responsive design
  - Dark mode support
  - Clean and minimalist interface
  - Interactive components

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 14
  - React 18
  - Tailwind CSS
  - Radix UI Components

- **Backend**
  - PostgreSQL with Neon
  - NextAuth.js for authentication
  - Node.js

- **Development Tools**
  - TypeScript
  - ESLint
  - Prettier

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/aakashkadyan/Task_Management_System.git
   cd Task_Management_System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:
   ```env
   DATABASE_URL=your_postgresql_url
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to see the application.

## 📱 Features in Detail

- **Task Creation and Management**
  - Title and description
  - Start and end dates
  - Priority levels
  - Status tracking
  - Categories and tags

- **User Dashboard**
  - Task statistics
  - Progress tracking
  - Upcoming deadlines
  - Performance metrics

- **Security Features**
  - JWT authentication
  - Secure password handling
  - Protected API routes
  - Session management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Aakash Kadyan
- GitHub: [@aakashkadyan](https://github.com/aakashkadyan)

## Project Structure

```
task-management-system/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── tasks/             # Task management pages
├── components/            # Reusable UI components
├── lib/                   # Utilities and services
│   ├── db/               # Database configuration
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## API Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/tasks` - Get tasks with pagination
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT FALSE
);
```

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [NextAuth.js](https://next-auth.js.org/)

##Hosted At
-----
[task-management-system-x98.vercel.app](https://task-management-system-x98k.vercel.app/dashboard)
