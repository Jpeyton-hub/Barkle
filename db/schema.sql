DROP DATABASE IF EXISTS barkle_db;

CREATE DATABASE barkle_db;

CREATE TABLE locations
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(225),
    mapData VARCHAR(225),  
    PRIMARY KEY(id)
);
