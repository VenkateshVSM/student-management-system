# Smart Student Management System

A full-stack student management project built with HTML5, CSS3, JavaScript, Node.js, Express.js, and Supabase (PostgreSQL) / MySQL, with JWT authentication.

## Features

- Admin, teacher, and student login with JWT
- Role-based access control
- Student, teacher, course, schedule, enrollment, attendance, marks, fees, notification, report, and audit modules
- Responsive dashboard UI
- Search and filter support
- Grade and GPA calculation
- Fee pending amount calculation
- Attendance percentage endpoint
- PDF report card download
- Excel export endpoint
- Supabase (PostgreSQL) and MySQL schema with sample seed data

## Folder Structure

```text
Student-Management-System/
├── client/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── css/
│   ├── js/
│   │   ├── auth.js
│   │   ├── config.js
│   │   ├── dashboard.js
│   │   └── supabase.js
│   └── images/
├── server/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   │   ├── db.js          # Dual database adapter (Supabase PostgreSQL & MySQL)
│   │   └── supabase.js    # Supabase JS SDK client
│   ├── models/
│   └── uploads/
├── database/
│   ├── supabase_schema.sql    # Supabase PostgreSQL schema & seed data
│   └── student_management.sql # MySQL schema & seed data
├── package.json
└── README.md
```

## Setup with Supabase

1. **Create a Supabase Project**:
   - Go to [Supabase](https://supabase.com) and create a new project.

2. **Run the Database Schema**:
   - In your Supabase project dashboard, open the **SQL Editor**.
   - Copy the contents of `database/supabase_schema.sql` and run it.
   - This creates all necessary tables, Row Level Security (RLS) policies, and demo seed data.

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Configure Environment Variables**:

   ```bash
   cp .env.example .env
   ```

   In `.env`:
   - Copy the **Connection URI** from **Project Settings -> Database -> Connection string** (URI format) into `DATABASE_URL`:
     ```env
     DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
     ```
   - (Optional) Copy your **Project URL** and **API Keys** from **Project Settings -> API** into:
     ```env
     SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
     SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
     SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
     ```

5. **Start the Server**:

   ```bash
   npm run dev
   ```

   Open `http://localhost:5000`.

---

## Alternative: Local MySQL Setup

If you prefer using a local MySQL instance:

1. Import schema:
   ```bash
   mysql -u root -p < database/student_management.sql
   ```
2. Configure `.env` with `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (leave `DATABASE_URL` commented out).
3. Start the server with `npm run dev`.

---

## Seed Logins

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@example.com | admin123 |
| Teacher | nisha@example.com | admin123 |
| Student | aarav@example.com | admin123 |

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/dashboard/admin`
- `GET /api/dashboard/teacher`
- `GET /api/dashboard/student`
- `/api/students`
- `/api/teachers`
- `/api/courses`
- `/api/schedules`
- `/api/enrollments`
- `/api/attendance`
- `/api/marks`
- `/api/fees`
- `/api/notifications`
- `GET /api/reports/semester/:studentId`
- `GET /api/reports/pdf/:studentId`
- `GET /api/reports/export/:table`

## Notes

Seed users use a plain demo password to simplify first-time setup. Accounts created through the register page are stored with bcrypt hashes.
