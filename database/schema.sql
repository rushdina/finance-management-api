/*
 Project: Personal Finance Management API
 
 Purpose:
 - Define database schema for PostgreSQL
 - Create categories and transactions tables
 - Insert initial category data
 
 Notes:
 - Queries were executed and tested using pgAdmin Query Tool.
 - This file is maintained for documentation, version control,
 and database recreation.
 */
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    item VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    category_id INTEGER NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

ALTER TABLE
    transactions RENAME COLUMN item TO title;

INSERT INTO
    categories (name)
VALUES
    ('Food'),
    ('Transport'),
    ('Shopping'),
    ('Salary'),
    ('Bills'),
    ('Entertainment'),
    ('Savings'),
    ('Others');

SELECT
    *
FROM
    categories;

SELECT
    *
FROM
    transactions;