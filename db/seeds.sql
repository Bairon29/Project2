DROP TABLE if EXISTS users;
DROP TABLE if EXISTS movies;


CREATE TABLE users(
id SERIAL PRIMARY KEY,
Fname VARCHAR(20),
Lname VARCHAR(20),
Email VARCHAR(60),
Password VARCHAR(60)
);

CREATE TABLE movies(
id SERIAL PRIMARY KEY,
name VARCHAR(50),
released_date VARCHAR(50),
length INTEGER,
budget INTEGER,
user_id INTEGER REFERENCES users(id)
);