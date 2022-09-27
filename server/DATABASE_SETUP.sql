-- NOTE! - This must be run manually once before using the application. It is NOT a stored procedure used by the application.

CREATE DATABASE TODO_LIST_DATA;

USE TODO_LIST_DATA;

CREATE TABLE todos(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    task VARCHAR(255) NOT NULL,
    date_added DATETIME NOT NULL
);

