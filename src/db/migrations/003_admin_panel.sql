USE forum_db;

ALTER TABLE sessions
    ADD COLUMN ip VARCHAR(45) NULL,
    ADD COLUMN user_agent VARCHAR(255) NULL;

CREATE TABLE request_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    method VARCHAR(10) NOT NULL,
    path VARCHAR(255) NOT NULL,
    status SMALLINT NOT NULL,
    duration_ms INT NOT NULL,
    ip VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_request_logs_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_moderation_actions_created_at ON moderation_actions (created_at);
