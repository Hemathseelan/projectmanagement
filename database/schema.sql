
CREATE DATABASE IF NOT EXISTS project_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE project_management;


CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL COMMENT 'bcrypt hash, never plain text',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  status ENUM('Not Started', 'In Progress', 'Completed') NOT NULL DEFAULT 'Not Started',
  start_date DATE,
  end_date DATE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  INDEX idx_projects_user_id (user_id),
  INDEX idx_projects_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
  due_date DATE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE,
  INDEX idx_tasks_project_id (project_id),
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_priority (priority)
) ENGINE=InnoDB;


