CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

DROP TABLE IF EXISTS report_cards;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS fees;
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Teacher', 'Student') NOT NULL DEFAULT 'Student',
  student_id INT NULL,
  teacher_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  dob DATE NULL,
  gender ENUM('Male', 'Female', 'Other') NULL,
  nationality VARCHAR(80) NULL,
  phone VARCHAR(30) NULL,
  email VARCHAR(160) NULL UNIQUE,
  address TEXT NULL,
  parent_details TEXT NULL,
  emergency_contact VARCHAR(120) NULL,
  previous_school VARCHAR(160) NULL,
  semester VARCHAR(40) NULL,
  department VARCHAR(120) NULL,
  status ENUM('Active', 'Inactive', 'Graduated', 'Suspended') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  department VARCHAR(120) NULL,
  specialization VARCHAR(160) NULL,
  email VARCHAR(160) NULL UNIQUE,
  phone VARCHAR(30) NULL,
  office_location VARCHAR(120) NULL,
  joining_date DATE NULL,
  salary DECIMAL(12,2) DEFAULT 0,
  role VARCHAR(80) DEFAULT 'Teacher',
  assigned_subjects TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(40) NOT NULL UNIQUE,
  course_name VARCHAR(160) NOT NULL,
  credits INT NOT NULL DEFAULT 0,
  description TEXT NULL,
  prerequisite VARCHAR(160) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  status ENUM('Registered', 'Dropped', 'Completed') DEFAULT 'Registered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NULL,
  teacher_id INT NULL,
  class_name VARCHAR(120) NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
  remarks VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

CREATE TABLE marks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  internal_marks DECIMAL(5,2) DEFAULT 0,
  assignment DECIMAL(5,2) DEFAULT 0,
  quiz DECIMAL(5,2) DEFAULT 0,
  project DECIMAL(5,2) DEFAULT 0,
  final_exam DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(6,2) DEFAULT 0,
  grade VARCHAR(5) NULL,
  gpa DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  tuition_fee DECIMAL(12,2) DEFAULT 0,
  hostel_fee DECIMAL(12,2) DEFAULT 0,
  bus_fee DECIMAL(12,2) DEFAULT 0,
  scholarship DECIMAL(12,2) DEFAULT 0,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  pending_amount DECIMAL(12,2) DEFAULT 0,
  payment_status ENUM('Pending', 'Partial', 'Paid') DEFAULT 'Pending',
  receipt_no VARCHAR(80) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(120) NOT NULL,
  room VARCHAR(80) NOT NULL,
  day VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  teacher_id INT NULL,
  teacher_name VARCHAR(120) NULL,
  course_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('New Assignment', 'Exam Date', 'Fee Reminder', 'Holiday Notice') NOT NULL,
  target_role ENUM('All', 'Admin', 'Teacher', 'Student') DEFAULT 'All',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(160) NOT NULL,
  ip_address VARCHAR(80) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE report_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  semester VARCHAR(40) NULL,
  gpa DECIMAL(3,2) DEFAULT 0,
  cgpa DECIMAL(3,2) DEFAULT 0,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO departments (name, description) VALUES
('Computer Science', 'Software, data, and systems programs'),
('Business Administration', 'Management and finance programs');

INSERT INTO students
(student_id, name, dob, gender, nationality, phone, email, address, parent_details, emergency_contact, previous_school, semester, department, status)
VALUES
('STU-001', 'Aarav Sharma', '2004-04-12', 'Male', 'Indian', '9876543210', 'aarav@example.com', 'Delhi', 'Ravi Sharma, Meera Sharma', '9876500001', 'Central High School', 'Semester 3', 'Computer Science', 'Active');

INSERT INTO teachers
(teacher_id, name, department, specialization, email, phone, office_location, joining_date, salary, role, assigned_subjects)
VALUES
('TCH-001', 'Dr. Nisha Rao', 'Computer Science', 'Database Systems', 'nisha@example.com', '9876500020', 'Block A-204', '2022-07-01', 85000, 'Professor', 'Database Systems, Web Development');

INSERT INTO courses (course_id, course_name, credits, description, prerequisite) VALUES
('CSE-201', 'Database Management Systems', 4, 'Relational modeling, SQL, transactions, and indexing.', 'Programming Fundamentals'),
('CSE-202', 'Web Application Development', 3, 'Client-server web applications using modern JavaScript.', 'HTML and JavaScript');

INSERT INTO enrollments (student_id, course_id, status) VALUES (1, 1, 'Registered'), (1, 2, 'Registered');
INSERT INTO attendance (student_id, course_id, teacher_id, class_name, attendance_date, status) VALUES
(1, 1, 1, 'CSE-A', CURDATE(), 'Present'),
(1, 2, 1, 'CSE-A', CURDATE(), 'Late');
INSERT INTO marks (student_id, course_id, internal_marks, assignment, quiz, project, final_exam, total, grade, gpa) VALUES
(1, 1, 15, 10, 8, 18, 42, 93, 'A+', 4.00);
INSERT INTO fees (student_id, tuition_fee, hostel_fee, bus_fee, scholarship, paid_amount, pending_amount, payment_status, receipt_no) VALUES
(1, 50000, 20000, 5000, 10000, 40000, 25000, 'Partial', 'R-1001');
INSERT INTO schedules (class_name, room, day, start_time, end_time, teacher_id, teacher_name, course_id) VALUES
('CSE-A', 'Lab 2', 'Tuesday', '10:00:00', '11:00:00', 1, 'Dr. Nisha Rao', 1);
INSERT INTO notifications (title, message, type, target_role) VALUES
('Database Assignment', 'Submit ER diagram assignment by Friday.', 'New Assignment', 'Student'),
('Fee Reminder', 'Please clear pending fees before the due date.', 'Fee Reminder', 'Student');

-- Default password for all seeded users is: admin123.
-- These seed rows use plain text for classroom/demo setup; registered users are stored with bcrypt hashes.
INSERT INTO users (name, email, password_hash, role, student_id, teacher_id) VALUES
('Admin User', 'admin@example.com', 'admin123', 'Admin', NULL, NULL),
('Dr. Nisha Rao', 'nisha@example.com', 'admin123', 'Teacher', NULL, 1),
('Aarav Sharma', 'aarav@example.com', 'admin123', 'Student', 1, NULL);
