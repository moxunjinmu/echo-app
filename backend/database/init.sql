# 数据库初始化脚本

CREATE DATABASE IF NOT EXISTS echo DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE echo;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(64) PRIMARY KEY,
  wechat_unionid VARCHAR(128) UNIQUE,
  wechat_openid_weapp VARCHAR(128),
  wechat_openid_app VARCHAR(128),
  phone VARCHAR(20) UNIQUE,
  nickname VARCHAR(50),
  avatar_url VARCHAR(255),
  vip_expire_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_unionid (wechat_unionid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 课程表
CREATE TABLE IF NOT EXISTS courses (
  course_id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(20),
  difficulty VARCHAR(20),
  cover_url VARCHAR(255),
  total_sentences INT DEFAULT 0,
  estimated_minutes INT DEFAULT 30,
  is_vip_only BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 句子表
CREATE TABLE IF NOT EXISTS sentences (
  sentence_id VARCHAR(64) PRIMARY KEY,
  course_id VARCHAR(64),
  sentence_index INT,
  audio_url VARCHAR(255),
  text_en TEXT,
  text_cn TEXT,
  start_time FLOAT,
  end_time FLOAT,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  INDEX idx_course (course_id),
  INDEX idx_index (sentence_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 学习记录表
CREATE TABLE IF NOT EXISTS user_study_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64),
  course_id VARCHAR(64),
  sentence_id VARCHAR(64),
  recognized_text TEXT,
  accuracy_score INT,
  is_weak BOOLEAN DEFAULT FALSE,
  client_type VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_weak (is_weak),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  order_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  product_type VARCHAR(20),
  amount DECIMAL(10, 2),
  payment_method VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending',
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
