CREATE DATABASE my_database1;
USE my_database1;
CREATE TABLE product1 (
	id INT NOT NULL primary key auto_increment,
    name varchar(100),
    price int not null,
    description varchar(255)
)