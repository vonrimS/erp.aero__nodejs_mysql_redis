CREATE DATABASE IF NOT EXISTS erp.aero.db;

USE erp.aero.db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email    VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
)