-- Create Database
CREATE DATABASE IF NOT EXISTS deadline_db;
USE deadline_db;

-- 1. Create users table
-- Purpose: store student account details.
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 2. Create subjects table
-- Purpose: store subjects/courses for each student.
CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Create tasks table
-- Purpose: store all assignments, exams, labs, vivas and deadlines.
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    task_type ENUM('Assignment', 'Exam', 'Lab', 'Viva') NOT NULL,
    deadline DATETIME NOT NULL,
    priority INT DEFAULT 1, -- 1: Low, 2: Medium, 3: High
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

-- 4. Create collision_alerts table
-- Purpose: store tasks having same or near deadlines.
CREATE TABLE collision_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    task1_id INT NOT NULL,
    task2_id INT NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task1_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (task2_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);

-- ==========================================
-- SAMPLE INSERT STATEMENTS
-- ==========================================

-- Insert sample users
INSERT INTO users (name, email, password) VALUES 
('Alice Smith', 'alice@college.edu', 'hashed_pass_123'),
('Bob Jones', 'bob@college.edu', 'hashed_pass_456');

-- Insert sample subjects
INSERT INTO subjects (user_id, subject_name) VALUES 
(1, 'Database Management Systems'),
(1, 'Operating Systems'),
(2, 'Computer Networks');

-- Insert sample tasks
INSERT INTO tasks (subject_id, title, task_type, deadline, priority, status) VALUES 
(1, 'DBMS Final Project Phase 1', 'Assignment', '2026-05-10 23:59:00', 3, 'Pending'),
(2, 'OS Midterm Exam', 'Exam', '2026-05-11 10:00:00', 3, 'Pending'),
(1, 'SQL Lab Evaluation', 'Lab', '2026-05-15 14:00:00', 2, 'Pending'),
(3, 'Networks Viva', 'Viva', '2026-05-10 15:00:00', 2, 'Pending');

-- ==========================================
-- DETECT DEADLINE COLLISIONS (SELF JOIN QUERY)
-- ==========================================
-- This query finds pairs of tasks (for the same user) 
-- where deadlines are exactly the same or within 1 day (24 hours) of each other.
SELECT 
    t1.task_id AS task1_id,
    t1.title AS task1_title,
    t1.deadline AS task1_deadline,
    t2.task_id AS task2_id,
    t2.title AS task2_title,
    t2.deadline AS task2_deadline,
    'Deadline collision detected!' AS alert_message
FROM 
    tasks t1
JOIN 
    tasks t2 ON t1.task_id < t2.task_id
WHERE 
    ABS(DATEDIFF(t1.deadline, t2.deadline)) <= 1;

-- 5. Create reschedule_suggestions table
-- Purpose: store automatically generated suggestions for clashing tasks
CREATE TABLE reschedule_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    suggested_date DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
