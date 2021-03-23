DROP DATABASE IF EXISTS barkle_db;

CREATE DATABASE barkle_db;

USE barkle_db;

CREATE TABLE locations
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(225),
    city VARCHAR(225),
    state VARCHAR(225),   
    PRIMARY KEY(id)
);
