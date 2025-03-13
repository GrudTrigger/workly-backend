CREATE TABLE IF NOT EXISTS account (
    id CHAR(27) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'moderator')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- Создание индекса для ускорения поиска по email
CREATE INDEX idx_account_email ON account(email);