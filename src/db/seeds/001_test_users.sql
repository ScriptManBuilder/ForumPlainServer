USE forum_db;

-- Admin: forumTestAdmin@gmail.com / Dp@s3sC0rd123!
INSERT INTO users (username, email, password_hash, role_id, created_at) VALUES
('forumAdmin', 'forumTestAdmin@gmail.com', '$2b$12$9rjddFQqGCEuqN7e4uIwv.cnnlhsYi9zOhJ8gqQLbHb1dBe44456C', 3, '2026-07-01 09:12:00');

-- Moderator: forumTestModerator@gmail.com / ModTest123!
INSERT INTO users (username, email, password_hash, role_id, created_at) VALUES
('forumModerator', 'forumTestModerator@gmail.com', '$2b$12$.YXZC/6f4ttRE4zUe92LKO9FljAnMlERv5hrCu4JRwpjHGu73Bti.', 2, '2026-07-15 14:30:00');

-- 10 regular test users, all password: password123
INSERT INTO users (username, email, password_hash, role_id, created_at) VALUES
('testuser01', 'testuser01@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-10-09 10:00:00'),
('testuser02', 'testuser02@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-10-06 18:45:00'),
('testuser03', 'testuser03@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-10-02 08:20:00'),
('testuser04', 'testuser04@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-09-27 16:10:00'),
('testuser05', 'testuser05@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-09-21 12:05:00'),
('testuser06', 'testuser06@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-09-14 09:40:00'),
('testuser07', 'testuser07@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-09-06 21:15:00'),
('testuser08', 'testuser08@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-08-28 11:30:00'),
('testuser09', 'testuser09@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-08-14 15:50:00'),
('testuser10', 'testuser10@example.com', '$2b$12$hyHv4qztAiJnePcY.4nHJeP0R86/NmzKea4RYF1RpLBQwT6DzuZBW', 1, '2026-07-28 07:25:00');
