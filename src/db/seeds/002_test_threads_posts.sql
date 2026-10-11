USE forum_db;

-- Threads in the "General" category, authored by seeded test users.
-- Uses subqueries by email/name instead of hardcoded ids, since ids
-- depend on what already exists in your database.

INSERT INTO threads (category_id, user_id, title, is_anonymous, created_at)
SELECT c.id, u.id, 'Welcome to the community!', 0, '2026-10-01 09:00:00'
FROM categories c, users u
WHERE c.name = 'General' AND u.email = 'forumTestAdmin@gmail.com';

INSERT INTO threads (category_id, user_id, title, is_anonymous, created_at)
SELECT c.id, u.id, 'Introduce yourself here', 0, '2026-10-02 10:30:00'
FROM categories c, users u
WHERE c.name = 'General' AND u.email = 'forumTestModerator@gmail.com';

INSERT INTO threads (category_id, user_id, title, is_anonymous, created_at)
SELECT c.id, u.id, 'How do you organize your daily tasks?', 0, '2026-10-03 14:15:00'
FROM categories c, users u
WHERE c.name = 'General' AND u.email = 'testuser03@example.com';

INSERT INTO threads (category_id, user_id, title, is_anonymous, created_at)
SELECT c.id, u.id, 'Best practices for staying productive', 0, '2026-10-04 11:45:00'
FROM categories c, users u
WHERE c.name = 'General' AND u.email = 'testuser05@example.com';

INSERT INTO threads (category_id, user_id, title, is_anonymous, created_at)
SELECT c.id, u.id, 'Anonymous feedback about the forum', 1, '2026-10-05 20:00:00'
FROM categories c, users u
WHERE c.name = 'General' AND u.email = 'testuser07@example.com';

INSERT INTO threads (category_id, user_id, title, is_anonymous, created_at)
SELECT c.id, u.id, 'What''s your favorite programming language?', 0, '2026-10-07 08:20:00'
FROM categories c, users u
WHERE c.name = 'General' AND u.email = 'testuser01@example.com';

INSERT INTO threads (category_id, user_id, title, is_anonymous, created_at)
SELECT c.id, u.id, 'Tips for staying motivated', 0, '2026-10-08 17:10:00'
FROM categories c, users u
WHERE c.name = 'General' AND u.email = 'testuser08@example.com';

INSERT INTO threads (category_id, user_id, title, is_anonymous, created_at)
SELECT c.id, u.id, 'Feedback wanted: new forum design', 0, '2026-10-09 13:00:00'
FROM categories c, users u
WHERE c.name = 'General' AND u.email = 'forumTestAdmin@gmail.com';

-- Posts (replies), referencing threads by title and users by email.

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Glad to be here, looking forward to the discussions!', '2026-10-01 10:05:00'
FROM threads t, users u
WHERE t.title = 'Welcome to the community!' AND u.email = 'testuser02@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Thanks for setting this up, excited to be part of it.', '2026-10-01 12:40:00'
FROM threads t, users u
WHERE t.title = 'Welcome to the community!' AND u.email = 'testuser04@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Hi everyone, I work mostly on backend stuff.', '2026-10-02 15:00:00'
FROM threads t, users u
WHERE t.title = 'Introduce yourself here' AND u.email = 'testuser01@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Hey! I do a bit of everything, mostly frontend lately.', '2026-10-02 16:20:00'
FROM threads t, users u
WHERE t.title = 'Introduce yourself here' AND u.email = 'testuser06@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'I use a simple to-do list and review it every morning.', '2026-10-03 15:00:00'
FROM threads t, users u
WHERE t.title = 'How do you organize your daily tasks?' AND u.email = 'testuser09@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Time-blocking works best for me, highly recommend it.', '2026-10-03 18:30:00'
FROM threads t, users u
WHERE t.title = 'How do you organize your daily tasks?' AND u.email = 'testuser10@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Good topic, following this one closely.', '2026-10-04 13:00:00'
FROM threads t, users u
WHERE t.title = 'Best practices for staying productive' AND u.email = 'testuser07@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'JavaScript for me, mostly out of necessity.', '2026-10-07 09:45:00'
FROM threads t, users u
WHERE t.title = 'What''s your favorite programming language?' AND u.email = 'testuser02@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Python, hard to beat for quick scripts.', '2026-10-07 11:10:00'
FROM threads t, users u
WHERE t.title = 'What''s your favorite programming language?' AND u.email = 'testuser03@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Honestly still deciding, enjoying both Go and Rust.', '2026-10-07 14:35:00'
FROM threads t, users u
WHERE t.title = 'What''s your favorite programming language?' AND u.email = 'testuser09@example.com';

INSERT INTO posts (thread_id, user_id, content, created_at)
SELECT t.id, u.id, 'Looks great so far, much easier to navigate.', '2026-10-09 15:20:00'
FROM threads t, users u
WHERE t.title = 'Feedback wanted: new forum design' AND u.email = 'testuser05@example.com';
