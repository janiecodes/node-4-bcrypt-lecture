CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email VARCHAR(40) NOT NULL,
    password TEXT NOT NULL
);