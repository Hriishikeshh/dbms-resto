
-- create
CREATE TABLE users (
    ph_number VARCHAR(15) PRIMARY KEY,  -- Primary Key (Atomic Value)
    name VARCHAR(50),
    table_num INT,
    payment_status enum('paid','not paid') not null default 'not paid'
);

CREATE TABLE tableinfo (
    table_num INT PRIMARY KEY,  -- Primary Key (Atomic Value)
    seats INT,
    status VARCHAR(10)  -- e.g., 'occupied', 'available'
);

CREATE TABLE menu (
    item_id INT PRIMARY KEY,  -- Primary Key (Atomic Value)
    item_name VARCHAR(50),
    price int,
    description TEXT
);

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    ph_number VARCHAR(15),
    table_num int,
    total int,
    date_time datetime,
    FOREIGN KEY (ph_number) REFERENCES Users(ph_number)
);

CREATE TABLE OrderItems (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    item_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (item_id) REFERENCES Menu(item_id)
);

INSERT INTO TableInfo (table_num, seats, status) VALUES (1, 4, 'available');
INSERT INTO TableInfo (table_num, seats, status) VALUES (2, 4, 'available');
INSERT INTO TableInfo (table_num, seats, status) VALUES (3, 4, 'available');
INSERT INTO TableInfo (table_num, seats, status) VALUES (4, 4, 'available');
INSERT INTO TableInfo (table_num, seats, status) VALUES (5, 4, 'available');

INSERT INTO Menu (item_id, item_name, price, description)
VALUES (100, 'Pasta', 250.00, 'Creamy Alfredo Pasta');
INSERT INTO Menu (item_id, item_name, price, description)
VALUES (101, 'Margherita Pizza', 350.00, 'Classic cheese and tomato pizza.');
INSERT INTO Menu (item_id, item_name, price, description)
VALUES (102, 'BBQ Chicken Pizza', 450.00, 'Pizza topped with barbecue chicken and mozzarella.');
INSERT INTO Menu (item_id, item_name, price, description)
VALUES (103, 'Veggie Burger', 150.00, 'A healthy burger with fresh vegetables and a soy patty.');
INSERT INTO Menu (item_id, item_name, price, description)
VALUES (104, 'Chicken Alfredo Pasta', 300.00, 'Creamy pasta with chicken and Alfredo sauce.');

-- retrieve bill
select*from Orders where ph_number=9021201303 and table_num=3;

update tableinfo set status='available' where table_num=?

update users set payment_status='paid' where ph_number=? and table_num=?

-- Retrieve ordered items
SELECT o.order_id,oi.item_id,oi.quantity,m.price
FROM OrderItems oi
JOIN Orders o ON o.order_id = oi.order_id
join Menu m on m.item_id=oi.item_id
where o.ph_number=1234 and o.table_num=3;





