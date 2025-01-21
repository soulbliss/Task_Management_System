# Task Management System

A modern, full-stack task management application built with Next.js, TypeScript, and PostgreSQL.

![Task Management System](./public/dashboard-preview.png)

## Features

- 🔐 **Secure Authentication**
  - Email and password-based authentication
  - Protected routes and API endpoints
  - Session management with NextAuth.js

- 📊 **Interactive Dashboard**
  - Real-time task statistics
  - Status distribution visualization
  - Recent tasks overview
  - Beautiful UI with gradients and animations

- ✅ **Task Management**
  - Create, read, update, and delete tasks
  - Set task status (Pending, In Progress, Completed)
  - Schedule tasks with start and end times
  - Filter and search tasks
  - Pagination support

- 🎨 **Modern UI/UX**
  - Responsive design
  - Glassmorphism effects
  - Smooth animations and transitions
  - Status-based color coding
  - Loading states and error handling

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Recharts for visualizations

- **Backend**
  - Next.js API Routes
  - PostgreSQL Database
  - NextAuth.js for authentication
  - Node-Postgres (pg) for database operations

- **Development**
  - ESLint for code quality
  - Prettier for code formatting
  - TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database server running
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/taskdb
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. Initialize the database:
```bash
npm run db:init
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Recharts](https://recharts.org/)

##Hosted At
-----
[task-management-system-x98.vercel.app](https://task-management-system-x98k.vercel.app/dashboard)
