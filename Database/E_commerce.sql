-- ===================================================================
-- 1. Drop tables
-- ===================================================================
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS cart_item CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS category CASCADE;

-- ===================================================================
-- 2. Create tables
-- ===================================================================

-- 2.1 Category
CREATE TABLE IF NOT EXISTS category (
  category_id    VARCHAR(10) PRIMARY KEY,
  category_name  VARCHAR(50) NOT NULL
);

-- 2.2 Customer (User)
CREATE TABLE IF NOT EXISTS customer (
  user_id           VARCHAR(20) PRIMARY KEY,
  full_name         VARCHAR(100) NOT NULL,
  email             VARCHAR(100) NOT NULL UNIQUE,
  psw               VARCHAR(50)  NOT NULL,
  phone             VARCHAR(15),
  customer_address  VARCHAR(200)
);

-- 2.3 Employee
CREATE TABLE IF NOT EXISTS employee (
  employee_id  VARCHAR(10) PRIMARY KEY,
  first_name   VARCHAR(50),
  last_name    VARCHAR(30),
  birth_date   DATE,
  address      VARCHAR(200),
  id_card      VARCHAR(15),
  role          INTEGER
);

-- 2.4 Product
CREATE TABLE IF NOT EXISTS product (
  category_id     VARCHAR(10) NOT NULL,
  product_id      VARCHAR(10) NOT NULL,
  product_name    VARCHAR(50) NOT NULL,
  description     VARCHAR(200),
  stock_quantity  INT         NOT NULL,
  image           VARCHAR(50),
  price           INT,
  PRIMARY KEY (category_id, product_id),
  FOREIGN KEY (category_id)
    REFERENCES category(category_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 2.5 Cart
CREATE TABLE IF NOT EXISTS cart (
  cart_id    VARCHAR(15) PRIMARY KEY,
  user_id    VARCHAR(20),
  created_at TIMESTAMP    NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES customer(user_id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

-- 2.6 Cart Item
CREATE TABLE IF NOT EXISTS cart_item (
  cart_item_id  VARCHAR(10) NOT NULL,
  cart_id       VARCHAR(15) NOT NULL,
  category_id   VARCHAR(10) NOT NULL,
  product_id    VARCHAR(10) NOT NULL,
  sold_price    INT,
  quantity      INT,
  PRIMARY KEY (category_id, cart_id, product_id, cart_item_id),
  FOREIGN KEY (cart_id)
    REFERENCES cart(cart_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (category_id, product_id)
    REFERENCES product(category_id, product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 2.7 Order
CREATE TABLE IF NOT EXISTS "order" (
  user_id       VARCHAR(20) NOT NULL,
  order_id      VARCHAR(15) NOT NULL,
  order_date    TIMESTAMP   NOT NULL,
  status        VARCHAR(10) NOT NULL,
  total_amount  INT         NOT NULL,
  PRIMARY KEY (user_id, order_id),
  FOREIGN KEY (user_id)
    REFERENCES customer(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 2.8 Order Item
CREATE TABLE IF NOT EXISTS order_item (
  order_item_id   VARCHAR(10) NOT NULL,
  user_id         VARCHAR(20) NOT NULL,
  order_id        VARCHAR(15) NOT NULL,
  category_id     VARCHAR(10) NOT NULL,
  product_id      VARCHAR(10) NOT NULL,
  order_price     INT         NOT NULL,
  order_quantity  INT,
  PRIMARY KEY (category_id, user_id, order_id, product_id, order_item_id),
  FOREIGN KEY (user_id, order_id)
    REFERENCES "order"(user_id, order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (category_id, product_id)
    REFERENCES product(category_id, product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 2.9 Payment
CREATE TABLE IF NOT EXISTS payment (
  payment_id     VARCHAR(10) PRIMARY KEY,
  user_id        VARCHAR(20),
  order_id       VARCHAR(15),
  payment_method VARCHAR(50) NOT NULL,
  payment_date   TIMESTAMP   NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id, order_id)
    REFERENCES "order"(user_id, order_id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

-- 2.10 Review
CREATE TABLE IF NOT EXISTS review (
  review_id    VARCHAR(10)  NOT NULL,
  category_id  VARCHAR(10)  NOT NULL,
  product_id   VARCHAR(10)  NOT NULL,
  user_id      VARCHAR(20)  NOT NULL,
  rating       INT          NOT NULL,
  comment      VARCHAR(200),
  review_date  TIMESTAMP,
  PRIMARY KEY (category_id, product_id, user_id, review_id),
  FOREIGN KEY (category_id, product_id)
    REFERENCES product(category_id, product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (user_id)
    REFERENCES customer(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ===================================================================
-- 3. Insert sample data for categories
-- ===================================================================
INSERT INTO category (category_id, category_name)
VALUES
  ('LAP', 'Laptops'),
  ('PHN', 'Phones'),
  ('HPH', 'Headphones');

-- ===================================================================
-- 4. Insert sample data for Dell laptops
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('LAP','DELL001','Dell Vostro 15 V3520 i5-1235U/16GB/512GB/15.6"FHD/Win11/Office HS21','Intel Core i5-1235U, 16GB RAM, 512GB SSD, 15.6" FHD, Win11, Office HS21',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL001.png',20490000),
  ('LAP','DELL002','Dell Inspiron 14 N5440 i5-1334U/16GB/512GB/14"FHD+/Win11/Office HS21','Intel Core i5-1334U, 16GB RAM, 512GB SSD, 14" FHD+, Win11, Office HS21',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL002.png',17490000),
  ('LAP','DELL003','Dell Vostro 15 V3530 i5-1335U/16GB/512GB/15.6"FHD/Win11/Office HS21','Intel Core i5-1335U, 16GB RAM, 512GB SSD, 15.6" FHD, Win11, Office HS21',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL003.png',17490000),
  ('LAP','DELL004','Dell Latitude 15 L3540 i5-1235U/16GB/512GB/15.6"FHD/Win11','Intel Core i5-1235U, 16GB RAM, 512GB SSD, 15.6" FHD, Win11',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL004.png',16990000),
  ('LAP','DELL005','Dell Inspiron 15 N3520 i5-1235U/16GB/512GB/15.6"FHD/Win11/Office HS21','Intel Core i5-1235U, 16GB RAM, 512GB SSD, 15.6" FHD, Win11, Office HS21',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL001.png',16190000),
  ('LAP','DELL006','Dell Vostro 15 V3520 i5 1235U/16GB/512GB/15.6"FHD/Win11/Office HS21','Intel Core i5-1235U, 16GB RAM, 512GB SSD, 15.6" FHD, Win11, Office HS21',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL002.png',15490000),
  ('LAP','DELL007','Dell Inspiron 15 3520 i5-1235U/16GB/512GB/15.6"FHD/Win11/Office HS24','Intel Core i5-1235U, 16GB RAM, 512GB SSD, 15.6" FHD, Win11, Office HS24',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL003.png',16190000),
  ('LAP','DELL008','Dell Latitude 3450 i5-1335U/16GB/512GB/14"FHD/Win11','Intel Core i5-1335U, 16GB RAM, 512GB SSD, 14" FHD, Win11',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL004.png',18890000),
  ('LAP','DELL009','Dell G15 5511 i7-11800H/16GB/512GB/15.6"FHD/120Hz','Intel Core i7-11800H, 16GB RAM, 512GB SSD, 15.6" FHD 120Hz, RTX3050 Ti',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL001.png',24990000),
  ('LAP','DELL010','Dell G15 5515 Ryzen 5 5600H/16GB/512GB/15.6"FHD/120Hz','AMD Ryzen 5 5600H, 16GB RAM, 512GB SSD, 15.6" FHD 120Hz, RTX3050',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL002.png',23990000),
  ('LAP','DELL011','Dell XPS 13 9315 i5-1230U/8GB/256GB/13.3"FHD+','Intel Core i5-1230U, 8GB RAM, 256GB SSD, 13.3" FHD+',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL003.png',33990000),
  ('LAP','DELL012','Dell XPS 15 9520 i7-12700H/16GB/512GB/15.6"4K','Intel Core i7-12700H, 16GB RAM, 512GB SSD, 15.6" 4K OLED',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL004.png',55990000),
  ('LAP','DELL013','Dell Alienware m15 R7 i7-12700H/16GB/1TB/15.6"QHD/240Hz','Intel Core i7-12700H, 16GB RAM, 1TB SSD, 15.6" QHD 240Hz, RTX3070 Ti',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL001.png',74990000),
  ('LAP','DELL014','Dell Alienware x14 i7-12700H/16GB/512GB/14"FHD/144Hz','Intel Core i7-12700H, 16GB RAM, 512GB SSD, 14" FHD 144Hz, RTX3060',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL002.png',61990000),
  ('LAP','DELL015','Dell Precision 3561 i5-11400H/8GB/512GB/15.6"FHD','Intel Core i5-11400H, 8GB RAM, 512GB SSD, 15.6" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL003.png',43990000),
  ('LAP','DELL016','Dell Latitude 5430 i5-1235U/16GB/512GB/14"FHD','Intel Core i5-1235U, 16GB RAM, 512GB SSD, 14" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\DELL004.png',28990000);

-- ===================================================================
-- 4.1 Insert sample data for HP laptops
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('LAP','HP001','HP Pavilion 15 eg2038TU i5-1235U/8GB/512GB/15.6"FHD','Intel Core i5-1235U, 8GB RAM, 512GB SSD, 15.6" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP001.png',16990000),
  ('LAP','HP002','HP Pavilion 14 eg2081TU i5-1235U/8GB/256GB/14"FHD','Intel Core i5-1235U, 8GB RAM, 256GB SSD, 14" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP002.png',15990000),
  ('LAP','HP003','HP Envy x360 13 ey0003TU i5-1235U/8GB/512GB/13.3"FHD Touch','Intel Core i5-1235U, 8GB RAM, 512GB SSD, 13.3" Touch FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP003.png',20990000),
  ('LAP','HP004','HP Envy 14 eb0023TU i7-13620H/16GB/512GB/14"2.2K','Intel Core i7-13620H, 16GB RAM, 512GB SSD, 14" 2.2K',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP004.png',25990000),
  ('LAP','HP005','HP Victus 16 fa0058TX Ryzen 5 5600H/8GB/512GB/16.1"FHD/144Hz','AMD Ryzen 5 5600H, 8GB RAM, 512GB SSD, 16.1" FHD 144Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP001.png',21990000),
  ('LAP','HP006','HP Victus 15 fa1063TX i5-11400H/8GB/512GB/15.6"FHD','Intel Core i5-11400H, 8GB RAM, 512GB SSD, 15.6" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP002.png',19990000),
  ('LAP','HP007','HP Omen 16 bn1036TX i7-12700H/16GB/512GB/16.1"QHD/165Hz','Intel Core i7-12700H, 16GB RAM, 512GB SSD, 16.1" QHD 165Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP003.png',41990000),
  ('LAP','HP008','HP Omen 15 ec1045AX Ryzen 7 5800H/16GB/1TB/15.6"FHD/144Hz','AMD Ryzen 7 5800H, 16GB RAM, 1TB SSD, 15.6" FHD 144Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP004.png',37990000),
  ('LAP','HP009','HP ProBook 450 G9 i5-1235U/16GB/512GB/15.6"FHD','Intel Core i5-1235U, 16GB RAM, 512GB SSD, 15.6" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP001.png',18990000),
  ('LAP','HP010','HP EliteBook 840 G9 i5-1240P/16GB/512GB/14"FHD','Intel Core i5-1240P, 16GB RAM, 512GB SSD, 14" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP002.png',29990000),
  ('LAP','HP011','HP ZBook Firefly 14 G9 i7-1260P/16GB/512GB/14"FHD','Intel Core i7-1260P, 16GB RAM, 512GB SSD, 14" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP003.png',45990000),
  ('LAP','HP012','HP Dragonfly Pro i7-1260P/16GB/1TB/15.6"4K','Intel Core i7-1260P, 16GB RAM, 1TB SSD, 15.6" 4K',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP004.png',61990000),
  ('LAP','HP013','HP Chromebook x360 14a-ca0005TU N4500/4GB/64GB/14"HD','Intel Celeron N4500, 4GB RAM, 64GB eMMC, 14" HD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP001.png',10990000),
  ('LAP','HP014','HP Chromebook 11a G8 N4500/4GB/64GB/11.6"HD','Intel Celeron N4500, 4GB RAM, 64GB eMMC, 11.6" HD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP002.png',9990000),
  ('LAP','HP015','HP Stream 14-ak0011TU N4020/4GB/64GB/14"HD','Intel Celeron N4020, 4GB RAM, 64GB eMMC, 14" HD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP003.png',7490000),
  ('LAP','HP016','HP Elite Dragonfly G2 i7-1185G7/16GB/512GB/13.3"FHD','Intel Core i7-1185G7, 16GB RAM, 512GB SSD, 13.3" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\HP004.png',55990000);

-- ===================================================================
-- 4.2 Insert sample data for Lenovo laptops
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('LAP','LEN001','Lenovo ThinkPad E14 Gen 5 i5-1235U/8GB/512GB/14"FHD','Intel Core i5-1235U, 8GB RAM, 512GB SSD, 14" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN001.png',19990000),
  ('LAP','LEN002','Lenovo IdeaPad 3 15IAU7 i3-1215U/8GB/512GB/15.6"FHD','Intel Core i3-1215U, 8GB RAM, 512GB SSD, 15.6" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN002.png',9290000),
  ('LAP','LEN003','Lenovo Yoga Slim 7 Carbon OLED i7-1260P/16GB/512GB/13.3"3K','Intel Core i7-1260P, 16GB RAM, 512GB SSD, 13.3" 3K OLED',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN003.png',30990000),
  ('LAP','LEN004','Lenovo IdeaPad Flex 5 14ALC7 Ryzen 5 7530U/8GB/512GB/14"FHD Touch','AMD Ryzen 5 7530U, 8GB RAM, 512GB SSD, 14" FHD Touch',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN004.png',15990000),
  ('LAP','LEN005','Lenovo ThinkBook 14 G4 ITL i5-1240P/8GB/512GB/14"FHD','Intel Core i5-1240P, 8GB RAM, 512GB SSD, 14" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN001.png',16990000),
  ('LAP','LEN006','Lenovo ThinkBook 16p G3 i7-12700H/16GB/512GB/16"QHD 120Hz','Intel Core i7-12700H, 16GB RAM, 512GB SSD, 16" QHD 120Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN002.png',32990000),
  ('LAP','LEN007','Lenovo IdeaPad Gaming 3 15IAH7 Ryzen 7 6800H/16GB/512GB/15.6"FHD 165Hz','AMD Ryzen 7 6800H, 16GB RAM, 512GB SSD, 15.6" FHD 165Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN003.png',18990000),
  ('LAP','LEN008','Lenovo Legion 5 15ARH8 Ryzen 7 5800H/16GB/512GB/15.6"FHD 165Hz','AMD Ryzen 7 5800H, 16GB RAM, 512GB SSD, 15.6" FHD 165Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN004.png',20990000),
  ('LAP','LEN009','Lenovo Legion 5 Pro 16ACH6H Ryzen 7 5800H/16GB/512GB/16"QHD 165Hz','AMD Ryzen 7 5800H, 16GB RAM, 512GB SSD, 16" QHD 165Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN001.png',32990000),
  ('LAP','LEN010','Lenovo Legion 5 16ARH8 Ryzen 5 5600H/16GB/512GB/16"FHD 120Hz','AMD Ryzen 5 5600H, 16GB RAM, 512GB SSD, 16" FHD 120Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN002.png',24990000),
  ('LAP','LEN011','Lenovo IdeaPad Gaming 3 15ACH6 Ryzen 5 5600H/8GB/512GB/15.6"FHD 120Hz','AMD Ryzen 5 5600H, 8GB RAM, 512GB SSD, 15.6" FHD 120Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN003.png',18990000),
  ('LAP','LEN012','Lenovo Yoga 7 14IAU7 i7-1255U/16GB/512GB/14"FHD Touch','Intel Core i7-1255U, 16GB RAM, 512GB SSD, 14" FHD Touch',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN004.png',29990000),
  ('LAP','LEN013','Lenovo ThinkBook 15 G4 ACL Ryzen 5 7530U/8GB/512GB/15.6"FHD','AMD Ryzen 5 7530U, 8GB RAM, 512GB SSD, 15.6" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN001.png',17990000),
  ('LAP','LEN014','Lenovo ThinkPad X1 Carbon Gen 10 i7-1260P/16GB/1TB/14"2.2K','Intel Core i7-1260P, 16GB RAM, 1TB SSD, 14" 2.2K',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN002.png',43990000),
  ('LAP','LEN015','Lenovo Yoga Slim 7 Pro 14ACH5 Ryzen 7 5800U/16GB/512GB/14"2.8K','AMD Ryzen 7 5800U, 16GB RAM, 512GB SSD, 14" 2.8K',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN003.png',27990000),
  ('LAP','LEN016','Lenovo Legion Slim 7 Gen 6 i7-12700H/16GB/1TB/16"QHD 165Hz','Intel Core i7-12700H, 16GB RAM, 1TB SSD, 16" QHD 165Hz',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\LEN004.png',36990000);

-- ===================================================================
-- 4.3 Insert sample data for Apple MacBook laptops
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('LAP','APP001','Apple MacBook Air M2 2022 13.6" Silver','Apple M2, 8GB RAM, 256GB SSD, 13.6" Liquid Retina',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP001.png',32990000),
  ('LAP','APP002','Apple MacBook Air M2 2022 13.6" Space Gray','Apple M2, 8GB RAM, 256GB SSD, 13.6" Liquid Retina',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP002.png',32990000),
  ('LAP','APP003','Apple MacBook Air M2 2022 13.6" Silver (512GB)','Apple M2, 8GB RAM, 512GB SSD, 13.6" Liquid Retina',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP003.png',38990000),
  ('LAP','APP004','Apple MacBook Air M2 2022 13.6" Space Gray (512GB)','Apple M2, 8GB RAM, 512GB SSD, 13.6" Liquid Retina',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP004.png',38990000),
  ('LAP','APP005','Apple MacBook Air M1 2020 13.3" Space Gray','Apple M1, 8GB RAM, 256GB SSD, 13.3" Retina',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP001.png',23990000),
  ('LAP','APP006','Apple MacBook Air M1 2020 13.3" Gold','Apple M1, 8GB RAM, 512GB SSD, 13.3" Retina',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP002.png',28990000),
  ('LAP','APP007','Apple MacBook Pro 13" M2 8GB/256GB Silver','Apple M2, 8GB RAM, 256GB SSD, 13.3" Retina',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP003.png',36990000),
  ('LAP','APP008','Apple MacBook Pro 13" M2 8GB/256GB Space Gray','Apple M2, 8GB RAM, 256GB SSD, 13.3" Retina',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP004.png',36990000),
  ('LAP','APP009','Apple MacBook Pro 14" M2 Pro 16GB/512GB Silver','Apple M2 Pro, 16GB RAM, 512GB SSD, 14.2" Liquid Retina XDR',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP001.png',53990000),
  ('LAP','APP010','Apple MacBook Pro 14" M2 Pro 16GB/512GB Space Gray','Apple M2 Pro, 16GB RAM, 512GB SSD, 14.2" Liquid Retina XDR',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP002.png',53990000),
  ('LAP','APP011','Apple MacBook Pro 14" M2 Pro 16GB/1TB Silver','Apple M2 Pro, 16GB RAM, 1TB SSD, 14.2" Liquid Retina XDR',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP003.png',60990000),
  ('LAP','APP012','Apple MacBook Pro 14" M2 Pro 16GB/1TB Space Gray','Apple M2 Pro, 16GB RAM, 1TB SSD, 14.2" Liquid Retina XDR',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP004.png',60990000),
  ('LAP','APP013','Apple MacBook Pro 16" M2 Pro 16GB/512GB Silver','Apple M2 Pro, 16GB RAM, 512GB SSD, 16.2" Liquid Retina XDR',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP001.png',64990000),
  ('LAP','APP014','Apple MacBook Pro 16" M2 Pro 16GB/512GB Space Gray','Apple M2 Pro, 16GB RAM, 512GB SSD, 16.2" Liquid Retina XDR',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP002.png',64990000),
  ('LAP','APP015','Apple MacBook Pro 16" M2 Max 32GB/1TB Silver','Apple M2 Max, 32GB RAM, 1TB SSD, 16.2" Liquid Retina XDR',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP003.png',98990000),
  ('LAP','APP016','Apple MacBook Pro 16" M2 Max 32GB/1TB Space Gray','Apple M2 Max, 32GB RAM, 1TB SSD, 16.2" Liquid Retina XDR',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APP004.png',98990000);

-- ===================================================================
-- 4.4 Insert sample data for Asus laptops
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('LAP','ASUS001','Asus Vivobook 15 X515EA i5-1135G7/8GB/512GB/15.6"FHD','Intel Core i5-1135G7, 8GB RAM, 512GB SSD, 15.6" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS001.png',12990000),
  ('LAP','ASUS002','Asus Vivobook 14 X413EA i5-1135G7/8GB/512GB/14"FHD','Intel Core i5-1135G7, 8GB RAM, 512GB SSD, 14" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS002.png',13990000),
  ('LAP','ASUS003','Asus ZenBook UX425EA i5-1135G7/8GB/512GB/13.3"FHD','Intel Core i5-1135G7, 8GB RAM, 512GB SSD, 13.3" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS003.png',17990000),
  ('LAP','ASUS004','Asus Vivobook S14 S433EA i7-1165G7/8GB/512GB/14"FHD','Intel Core i7-1165G7, 8GB RAM, 512GB SSD, 14" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS004.png',15990000),
  ('LAP','ASUS005','Asus Vivobook 15 K513EA i5-1135G7/8GB/512GB/15.6"FHD','Intel Core i5-1135G7, 8GB RAM, 512GB SSD, 15.6" FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS001.png',12490000),
  ('LAP','ASUS006','Asus ZenBook Flip 13 UX363EA i5-1135G7/8GB/512GB/13.3"Touch FHD','Intel Core i5-1135G7, 8GB RAM, 512GB SSD, 13.3" Touch FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS002.png',18990000),
  ('LAP','ASUS007','Asus ExpertBook B5 Flip B5302C i5-1135G7/16GB/512GB/13.3"FHD Touch','Intel Core i5-1135G7, 16GB RAM, 512GB SSD, 13.3" Touch FHD',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS003.png',21990000),
  ('LAP','ASUS008','Asus ZenBook 14 UX435EG i7-1165G7/16GB/512GB/14"OLED','Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 14" OLED',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS004.png',23990000),
  ('LAP','ASUS009','Asus TUF Gaming F15 FX506LH i5-10300H/8GB/512GB/15.6"FHD/144Hz','Intel Core i5-10300H, 8GB RAM, 512GB SSD, 15.6" FHD 144Hz, GTX1650',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS001.png',18990000),
  ('LAP','ASUS010','Asus TUF Gaming A15 FA506IHR Ryzen 5 4600H/8GB/512GB/15.6"FHD/144Hz','AMD Ryzen 5 4600H, 8GB RAM, 512GB SSD, 15.6" FHD 144Hz, GTX1650Ti',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS002.png',19990000),
  ('LAP','ASUS011','Asus ROG Strix G15 G513IE i7-11370H/16GB/512GB/15.6"FHD/144Hz','Intel Core i7-11370H, 16GB RAM, 512GB SSD, 15.6" FHD 144Hz, RTX3050',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS003.png',28990000),
  ('LAP','ASUS012','Asus ROG Zephyrus G14 GA401QM Ryzen 9 5900HS/16GB/1TB/14"QHD/120Hz','AMD Ryzen 9 5900HS, 16GB RAM, 1TB SSD, 14" QHD 120Hz, RTX3060',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS004.png',36990000),
  ('LAP','ASUS013','Asus ROG Zephyrus G15 GA503QM Ryzen 9 5900HS/16GB/1TB/15.6"QHD/165Hz','AMD Ryzen 9 5900HS, 16GB RAM, 1TB SSD, 15.6" QHD 165Hz, RTX3070',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS001.png',42990000),
  ('LAP','ASUS014','Asus ROG Zephyrus M16 GU603HR i7-11800H/16GB/1TB/16"WQXGA/165Hz','Intel Core i7-11800H, 16GB RAM, 1TB SSD, 16" WQXGA 165Hz, RTX3060',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS002.png',41990000),
  ('LAP','ASUS015','Asus TUF Dash F15 FX516PM i7-11370H/16GB/512GB/15.6"FHD/144Hz','Intel Core i7-11370H, 16GB RAM, 512GB SSD, 15.6" FHD 144Hz, RTX3060',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS003.png',32990000),
  ('LAP','ASUS016','Asus ROG Flow X13 GV301QE Ryzen 9 5900HS/16GB/512GB/13.4"FHD/120Hz','AMD Ryzen 9 5900HS, 16GB RAM, 512GB SSD, 13.4" FHD 120Hz, RTX3050Ti',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ASUS004.png',39990000);

-- ===================================================================
-- 4.5 Insert sample data for Apple phones
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('PHN','APL001','Apple iPhone 14 Pro Max 128GB Silver','Apple A16 Bionic, 6GB RAM, 128GB storage, 6.7" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL001.png',27390000),
  ('PHN','APL002','Apple iPhone 14 Pro Max 256GB Space Black','Apple A16 Bionic, 6GB RAM, 256GB storage, 6.7" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL002.png',28990000),
  ('PHN','APL003','Apple iPhone 14 Pro 128GB Gold','Apple A16 Bionic, 6GB RAM, 128GB storage, 6.1" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL003.png',23590000),
  ('PHN','APL004','Apple iPhone 14 Pro 256GB Silver','Apple A16 Bionic, 6GB RAM, 256GB storage, 6.1" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL004.png',28990000),
  ('PHN','APL005','Apple iPhone 14 Plus 128GB Blue','Apple A15 Bionic, 6GB RAM, 128GB storage, 6.7" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL001.png',24990000),
  ('PHN','APL006','Apple iPhone 14 128GB Midnight','Apple A15 Bionic, 6GB RAM, 128GB storage, 6.1" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL002.png',21990000),
  ('PHN','APL007','Apple iPhone 13 Pro Max 128GB Graphite','Apple A15 Bionic, 6GB RAM, 128GB storage, 6.7" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL003.png',27990000),
  ('PHN','APL008','Apple iPhone 13 Pro 128GB Silver','Apple A15 Bionic, 6GB RAM, 128GB storage, 6.1" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL004.png',23990000),
  ('PHN','APL009','Apple iPhone 13 128GB Pink','Apple A15 Bionic, 4GB RAM, 128GB storage, 6.1" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL001.png',18990000),
  ('PHN','APL010','Apple iPhone 12 64GB Black','Apple A14 Bionic, 4GB RAM, 64GB storage, 6.1" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL002.png',15990000),
  ('PHN','APL011','Apple iPhone 12 128GB White','Apple A14 Bionic, 4GB RAM, 128GB storage, 6.1" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL003.png',16990000),
  ('PHN','APL012','Apple iPhone 12 mini 64GB Blue','Apple A14 Bionic, 4GB RAM, 64GB storage, 5.4" Super Retina XDR OLED, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL004.png',14990000),
  ('PHN','APL013','Apple iPhone SE (2022) 128GB (PRODUCT) RED','Apple A15 Bionic, 4GB RAM, 128GB storage, 4.7" Retina HD, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL001.png',15990000),
  ('PHN','APL014','Apple iPhone SE (2022) 256GB White','Apple A15 Bionic, 4GB RAM, 256GB storage, 4.7" Retina HD, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL002.png',18990000),
  ('PHN','APL015','Apple iPhone 11 64GB Yellow','Apple A13 Bionic, 4GB RAM, 64GB storage, 6.1" Liquid Retina HD, 4G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL003.png',15990000),
  ('PHN','APL016','Apple iPhone 11 128GB Black','Apple A13 Bionic, 4GB RAM, 128GB storage, 6.1" Liquid Retina HD, 4G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APL004.png',16990000);

-- ===================================================================
-- 4.6 Insert sample data for Samsung phones
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('PHN','SAM001','Samsung Galaxy S24 Ultra 5G 256GB','Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, 6.8" Dynamic AMOLED 2X QHD+ 1-120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM001.png',30990000),
  ('PHN','SAM002','Samsung Galaxy S24 Ultra 5G 512GB','Snapdragon 8 Gen 3, 12GB RAM, 512GB storage, 6.8" Dynamic AMOLED 2X QHD+ 1-120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM002.png',34490000),
  ('PHN','SAM003','Samsung Galaxy S24 Ultra 5G 1TB','Snapdragon 8 Gen 3, 12GB RAM, 1TB storage, 6.8" Dynamic AMOLED 2X QHD+ 1-120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM003.png',41490000),
  ('PHN','SAM004','Samsung Galaxy S24+ 5G 256GB','Exynos 2400, 12GB RAM, 256GB storage, 6.7" Dynamic AMOLED 2X QHD+ 1-120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM004.png',26990000),
  ('PHN','SAM005','Samsung Galaxy S24+ 5G 512GB','Exynos 2400, 12GB RAM, 512GB storage, 6.7" Dynamic AMOLED 2X QHD+ 1-120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM001.png',30490000),
  ('PHN','SAM006','Samsung Galaxy S24 5G 256GB','Exynos 2400, 8GB RAM, 256GB storage, 6.2" Dynamic AMOLED 2X FHD+ 1-120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM002.png',22990000),
  ('PHN','SAM007','Samsung Galaxy S24 5G 512GB','Exynos 2400, 8GB RAM, 512GB storage, 6.2" Dynamic AMOLED 2X FHD+ 1-120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM003.png',26490000),
  ('PHN','SAM008','Samsung Galaxy Z Flip4 5G 128GB','Snapdragon 8 Gen 1, 8GB RAM, 128GB storage, 6.7" Dynamic AMOLED 2X FHD+ 1-120Hz, 5G foldable',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM004.png',23990000),
  ('PHN','SAM009','Samsung Galaxy A54 5G 128GB','Exynos 1380, 8GB RAM, 128GB storage, 6.4" Super AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM001.png',10490000),
  ('PHN','SAM010','Samsung Galaxy A54 5G 256GB','Exynos 1380, 8GB RAM, 256GB storage, 6.4" Super AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM002.png',11490000),
  ('PHN','SAM011','Samsung Galaxy A34 5G 128GB','Exynos 1280, 6GB RAM, 128GB storage, 6.6" Super AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM003.png',8490000),
  ('PHN','SAM012','Samsung Galaxy A14 4G 128GB','Exynos 850, 4GB RAM, 128GB storage, 6.6" PLS LCD FHD+ 60Hz, 4G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM004.png',4490000),
  ('PHN','SAM013','Samsung Galaxy M14 4G 64GB','Exynos 850, 4GB RAM, 64GB storage, 6.6" PLS LCD FHD+ 60Hz, 4G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM001.png',5300000),
  ('PHN','SAM014','Samsung Galaxy M14 5G 64GB','Exynos 1330, 4GB RAM, 64GB storage, 6.6" PLS LCD FHD+ 90Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM002.png',5300000),
  ('PHN','SAM015','Samsung Galaxy M34 5G 128GB','Exynos 1280, 6GB RAM, 128GB storage, 6.5" Super AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM003.png',7490000),
  ('PHN','SAM016','Samsung Galaxy Z Fold5 5G 256GB','Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, 7.6" Dynamic AMOLED 2X QXGA+ 120Hz cover display',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SAM004.png',33690000);

-- ===================================================================
-- 4.7 Insert sample data for Xiaomi phones
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('PHN','XIA001','Xiaomi 13 Pro 5G 12GB/256GB Alpine White','Snapdragon 8 Gen 2, 12GB RAM, 256GB storage, 6.73" AMOLED 1.5K 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA001.png',23990000),
  ('PHN','XIA002','Xiaomi 13 Pro 5G 12GB/512GB Ceramic Black','Snapdragon 8 Gen 2, 12GB RAM, 512GB storage, 6.73" AMOLED 1.5K 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA002.png',25990000),
  ('PHN','XIA003','Xiaomi 13 5G 8GB/128GB Blue','Snapdragon 8 Gen 2, 8GB RAM, 128GB storage, 6.36" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA003.png',18990000),
  ('PHN','XIA004','Xiaomi 13 5G 8GB/256GB Black','Snapdragon 8 Gen 2, 8GB RAM, 256GB storage, 6.36" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA004.png',20990000),
  ('PHN','XIA005','Xiaomi 12T Pro 5G 8GB/128GB Blue','Snapdragon 8+ Gen 1, 8GB RAM, 128GB storage, 6.67" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA001.png',16990000),
  ('PHN','XIA006','Xiaomi 12T 5G 8GB/128GB Gray','MediaTek Dimensity 8100-Ultra, 8GB RAM, 128GB storage, 6.67" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA002.png',13990000),
  ('PHN','XIA007','Xiaomi 12 Pro 5G 8GB/256GB Silver','Snapdragon 8 Gen 1, 8GB RAM, 256GB storage, 6.73" AMOLED 1.5K 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA003.png',18990000),
  ('PHN','XIA008','Xiaomi 12 5G 8GB/128GB Purple','Snapdragon 8 Gen 1, 8GB RAM, 128GB storage, 6.28" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA004.png',15990000),
  ('PHN','XIA009','Xiaomi Redmi Note 12 Pro 5G 6GB/128GB Green','MediaTek Dimensity 1080, 6GB RAM, 128GB storage, 6.67" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA001.png',7990000),
  ('PHN','XIA010','Xiaomi Redmi Note 12 Pro+ 5G 8GB/256GB Gray','MediaTek Dimensity 1080, 8GB RAM, 256GB storage, 6.67" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA002.png',9990000),
  ('PHN','XIA011','Xiaomi Redmi Note 12 4G 4GB/128GB Blue','Qualcomm Snapdragon 685, 4GB RAM, 128GB storage, 6.67" IPS LCD FHD+ 90Hz, 4G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA003.png',5990000),
  ('PHN','XIA012','Xiaomi Redmi 12C 4G 4GB/64GB Black','MediaTek Helio G85, 4GB RAM, 64GB storage, 6.71" IPS LCD HD+ 60Hz, 4G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA004.png',3490000),
  ('PHN','XIA013','Xiaomi POCO X6 Pro 5G 8GB/256GB Black','Snapdragon 7+ Gen 2, 8GB RAM, 256GB storage, 6.67" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA001.png',9490000),
  ('PHN','XIA014','Xiaomi POCO F5 5G 8GB/256GB Green','Snapdragon 7+ Gen 2, 8GB RAM, 256GB storage, 6.67" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA002.png',10790000),
  ('PHN','XIA015','Xiaomi 11T 5G 8GB/128GB Meteorite Gray','MediaTek Dimensity 1200-Ultra, 8GB RAM, 128GB storage, 6.67" AMOLED FHD+ 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA003.png',9190000),
  ('PHN','XIA016','Xiaomi MIX Fold 2 12GB/256GB Black','Snapdragon 8+ Gen 1, 12GB RAM, 256GB storage, 8.02" AMOLED foldable, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\XIA004.png',49990000);

-- ===================================================================
-- 4.8 Insert sample data for OnePlus phones
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('PHN','ONE001','OnePlus 11 5G 12GB/256GB Black','Snapdragon 8 Gen 2, 12GB RAM, 256GB storage, 6.7" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE001.png',23990000),
  ('PHN','ONE002','OnePlus 11 5G 12GB/512GB Green','Snapdragon 8 Gen 2, 12GB RAM, 512GB storage, 6.7" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE002.png',25990000),
  ('PHN','ONE003','OnePlus 11R 5G 8GB/128GB Blue','Snapdragon 8+ Gen 1, 8GB RAM, 128GB storage, 6.7" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE001.png',13990000),
  ('PHN','ONE004','OnePlus 11R 5G 8GB/256GB Black','Snapdragon 8+ Gen 1, 8GB RAM, 256GB storage, 6.7" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE002.png',15990000),
  ('PHN','ONE005','OnePlus 10 Pro 5G 12GB/256GB Emerald Forest','Snapdragon 8 Gen 1, 12GB RAM, 256GB storage, 6.7" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE001.png',22990000),
  ('PHN','ONE006','OnePlus 10 Pro 5G 12GB/512GB Sierra Black','Snapdragon 8 Gen 1, 12GB RAM, 512GB storage, 6.7" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE002.png',25990000),
  ('PHN','ONE007','OnePlus 10T 5G 8GB/128GB White','Snapdragon 8+ Gen 1, 8GB RAM, 128GB storage, 6.7" Fluid AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE001.png',12990000),
  ('PHN','ONE008','OnePlus 10T 5G 12GB/256GB Gray','Snapdragon 8+ Gen 1, 12GB RAM, 256GB storage, 6.7" Fluid AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE002.png',14990000),
  ('PHN','ONE009','OnePlus Nord 3 5G 8GB/128GB Floral Green','Dimensity 9000, 8GB RAM, 128GB storage, 6.74" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE001.png',11990000),
  ('PHN','ONE010','OnePlus Nord 3 5G 12GB/256GB Blue Marble','Dimensity 9000, 12GB RAM, 256GB storage, 6.74" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE002.png',13990000),
  ('PHN','ONE011','OnePlus Nord CE 3 5G 8GB/128GB Gray','Dimensity 7030, 8GB RAM, 128GB storage, 6.7" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE001.png',9990000),
  ('PHN','ONE012','OnePlus Nord CE 3 5G 12GB/256GB Blue','Dimensity 7030, 12GB RAM, 256GB storage, 6.7" AMOLED 120Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE002.png',11990000),
  ('PHN','ONE013','OnePlus Nord N30 5G 6GB/128GB Black','Snapdragon 695, 6GB RAM, 128GB storage, 6.72" IPS LCD 90Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE001.png',5990000),
  ('PHN','ONE014','OnePlus Nord N30 5G 8GB/256GB Blue','Snapdragon 695, 8GB RAM, 256GB storage, 6.72" IPS LCD 90Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE002.png',7990000),
  ('PHN','ONE015','OnePlus Nord 2T 5G 8GB/128GB Gray','Dimensity 1300, 8GB RAM, 128GB storage, 6.43" Fluid AMOLED 90Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE001.png',8990000),
  ('PHN','ONE016','OnePlus Nord 2T 5G 12GB/256GB Pink','Dimensity 1300, 12GB RAM, 256GB storage, 6.43" Fluid AMOLED 90Hz, 5G',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\ONE002.png',10990000);

-- ===================================================================
-- 4.9 Insert sample data for Sony headphones
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('HPH','SONY001','Sony WH-1000XM5','Tai nghe chụp tai Bluetooth chống ồn chủ động cao cấp, pin đến 40h, Bluetooth 5.2',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY001.png',7990000),
  ('HPH','SONY002','Sony WH-1000XM4','Tai nghe chụp tai Bluetooth chống ồn chủ động, pin đến 30h, Bluetooth 5.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY002.png',6290000),
  ('HPH','SONY003','Sony WH-1000XM3','Tai nghe chụp tai chống ồn chủ động, pin đến 30h, Bluetooth 4.2',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY003.png',4990000),
  ('HPH','SONY004','Sony WF-1000XM5','Tai nghe true wireless chống ồn, pin đến 8h, Bluetooth 5.3',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY001.png',6990000),
  ('HPH','SONY005','Sony WF-1000XM4','Tai nghe true wireless chống ồn, pin đến 8h, Bluetooth 5.2',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY002.png',4990000),
  ('HPH','SONY006','Sony WF-1000XM3','Tai nghe true wireless chống ồn, pin đến 6h, Bluetooth 5.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY003.png',3490000),
  ('HPH','SONY007','Sony WH-XB910N','Tai nghe chụp tai Extra Bass, pin đến 30h, Bluetooth 5.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY001.png',2990000),
  ('HPH','SONY008','Sony WH-XB700','Tai nghe chụp tai Extra Bass, pin đến 30h, Bluetooth 5.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY002.png',1490000),
  ('HPH','SONY009','Sony WH-CH710N','Tai nghe chụp tai chống ồn, pin đến 35h, Bluetooth 5.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY003.png',1990000),
  ('HPH','SONY010','Sony WH-CH520','Tai nghe chụp tai không dây, pin đến 50h, Bluetooth 5.3',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY001.png',990000),
  ('HPH','SONY011','Sony WH-CH510','Tai nghe chụp tai không dây, pin đến 35h, Bluetooth 5.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY002.png',690000),
  ('HPH','SONY012','Sony Inzone H3','Tai nghe chơi game có dây, driver 40mm, mic lọc ồn, jack 3.5mm',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY003.png',1290000),
  ('HPH','SONY013','Sony Inzone H9','Tai nghe chơi game không dây, chống ồn, pin đến 32h, USB-C',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY001.png',6490000),
  ('HPH','SONY014','Sony LinkBuds S','Tai nghe true wireless, thiết kế mở, driver 12mm, Bluetooth 5.2',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY002.png',4990000),
  ('HPH','SONY015','Sony LinkBuds','Tai nghe true wireless mở, driver 12mm, pin đến 5.5h, Bluetooth 5.2',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY003.png',2790000),
  ('HPH','SONY016','Sony WF-C500','Tai nghe true wireless, pin đến 10h, Bluetooth 5.0, chống nước IPX4',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\SONY001.png',890000);

-- ===================================================================
-- 4.10 Insert sample data for Bose headphones
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('HPH','BOS001','Bose QuietComfort 45','Tai nghe chụp tai không dây chống ồn chủ động, pin đến 24h, Bluetooth 5.1',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS001.png',7990000),
  ('HPH','BOS002','Bose QuietComfort 35 II','Tai nghe chụp tai không dây chống ồn chủ động, pin đến 20h, Bluetooth 4.1',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS002.png',6290000),
  ('HPH','BOS003','Bose Noise Cancelling Headphones 700','Tai nghe chụp tai ANC, pin đến 20h, Bluetooth 5.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS003.png',7990000),
  ('HPH','BOS004','Bose QuietComfort Earbuds','Tai nghe true wireless chống ồn, pin đến 6h, Bluetooth 5.1',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS001.png',6990000),
  ('HPH','BOS005','Bose QuietComfort Earbuds II','Tai nghe true wireless chống ồn, pin đến 6h, Bluetooth 5.3',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS002.png',8990000),
  ('HPH','BOS006','Bose Sport Earbuds','Tai nghe true wireless thể thao, pin đến 5h, Bluetooth 5.1',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS003.png',3490000),
  ('HPH','BOS007','Bose SoundSport Wireless','Tai nghe không dây thể thao, pin đến 6h, chống mồ hôi',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS001.png',2490000),
  ('HPH','BOS008','Bose SoundSport Free','Tai nghe true wireless thể thao, pin đến 5h, chống nước IPX4',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS002.png',3990000),
  ('HPH','BOS009','Bose SoundLink Around-Ear Wireless Headphones II','Tai nghe chụp tai không dây, pin đến 15h, Bluetooth 4.2',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS003.png',3490000),
  ('HPH','BOS010','Bose QuietComfort 20i','Tai nghe in-ear có dây chống ồn chủ động, pin ráy tai',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS001.png',3490000),
  ('HPH','BOS011','Bose QuietComfort 25','Tai nghe chụp tai có dây chống ồn, pin đến 20h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS002.png',2490000),
  ('HPH','BOS012','Bose ProFlight Aviation Headset','Tai nghe phi công chuyên nghiệp, chống ồn, mic tích hợp',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS003.png',15990000),
  ('HPH','BOS013','Bose SoundTrue Ultra','Tai nghe on-ear không dây, pin đến 16h, Bluetooth 4.1',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS001.png',1490000),
  ('HPH','BOS014','Bose SoundLink On-Ear Wireless Headphones','Tai nghe on-ear không dây, pin đến 15h, Bluetooth 3.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS002.png',2990000),
  ('HPH','BOS015','Bose SoundSport Ultra Edition','Tai nghe in-ear thể thao có dây, chống mồ hôi, pin đến 6h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS003.png',1790000),
  ('HPH','BOS016','Bose QuietComfort 15','Tai nghe chụp tai chống ồn có dây, pin đến 25h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\BOS001.png',1990000);

-- ===================================================================
-- 4.11 Insert sample data for JBL headphones
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('HPH','JBL001','JBL Tune 500BT','Tai nghe chụp tai Bluetooth 5.0, pin đến 16h, nhẹ nhàng',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL001.png',890000),
  ('HPH','JBL002','JBL Tune 510BT','Tai nghe chụp tai Bluetooth 5.0, pin đến 40h, hỗ trợ nhiều màu',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL002.png',990000),
  ('HPH','JBL003','JBL Tune 660NC','Tai nghe chụp tai chống ồn chủ động, pin đến 40h, Bluetooth 5.0',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL003.png',2490000),
  ('HPH','JBL004','JBL Live 660NC','Tai nghe không dây chống ồn, pin đến 50h, âm bass mạnh mẽ',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL001.png',2690000),
  ('HPH','JBL005','JBL Club 950NC','Tai nghe chụp tai cao cấp, pin đến 55h, chống ồn chủ động',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL002.png',3290000),
  ('HPH','JBL006','JBL Club 700BT','Tai nghe chụp tai Bluetooth, pin đến 50h, âm thanh rõ nét',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL003.png',2490000),
  ('HPH','JBL007','JBL Reflect Flow','Tai nghe true wireless thể thao, pin đến 10h, chống nước IPX7',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL001.png',1790000),
  ('HPH','JBL008','JBL Endurance Peak II','Tai nghe true wireless thể thao, pin đến 30h, chống nước IPX7',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL002.png',1990000),
  ('HPH','JBL009','JBL Quantum 600','Tai nghe chơi game không dây, âm thanh vòm, mic khử ồn',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL003.png',2390000),
  ('HPH','JBL010','JBL Quantum 800','Tai nghe chơi game không dây cao cấp, pin đến 14h, vòm 7.1',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL001.png',3390000),
  ('HPH','JBL011','JBL Quantum 300','Tai nghe chơi game có dây, âm thanh vòm, mic đa hướng',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL002.png',1290000),
  ('HPH','JBL012','JBL Quantum 100','Tai nghe chơi game có dây, driver 40mm, thoải mái',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL003.png',790000),
  ('HPH','JBL013','JBL Tune Flex','Tai nghe true wireless, pin đến 8h, âm trầm mạnh mẽ',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL001.png',1590000),
  ('HPH','JBL014','JBL Live Free NC+','Tai nghe true wireless chống ồn, pin đến 28h, kháng nước IPX7',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL002.png',2390000),
  ('HPH','JBL015','JBL Tune 760NC','Tai nghe chụp tai chống ồn chủ động, pin đến 50h, thoải mái',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL003.png',2290000),
  ('HPH','JBL016','JBL Endurance Run','Tai nghe thể thao không dây, pin đến 12h, chống mồ hôi',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\JBL001.png',1090000);
  
-- ===================================================================
-- 4.12 Insert sample data for Apple headphones
-- ===================================================================
INSERT INTO product (category_id, product_id, product_name, description, stock_quantity, image, price)
VALUES
  ('HPH','APLHPH001','Apple AirPods Pro 2nd Gen','Tai nghe true wireless chống ồn, H2 chip, Spatial Audio, pin case đến 30h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH001.png',5990000),
  ('HPH','APLHPH002','Apple AirPods Pro','Tai nghe true wireless chống ồn, H1 chip, Spatial Audio, pin case đến 24h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH002.png',4990000),
  ('HPH','APLHPH003','Apple AirPods 3rd Gen','Tai nghe true wireless, Spatial Audio, pin case đến 30h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH003.png',3990000),
  ('HPH','APLHPH004','Apple AirPods 2nd Gen','Tai nghe true wireless, H1 chip, pin case đến 24h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH001.png',2490000),
  ('HPH','APLHPH005','Apple AirPods Max','Tai nghe chụp tai chống ồn, H1 chip, Spatial Audio, pin đến 20h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH002.png',12990000),
  ('HPH','APLHPH006','Apple Beats Studio3 Wireless','Tai nghe chụp tai Bluetooth, chống ồn, pin đến 22h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH003.png',6890000),
  ('HPH','APLHPH007','Apple Beats Solo Pro','Tai nghe chụp tai chống ồn, pin đến 22h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH001.png',4990000),
  ('HPH','APLHPH008','Apple Beats Flex','Tai nghe neckband Bluetooth, pin đến 12h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH002.png',1290000),
  ('HPH','APLHPH009','Apple Beats Powerbeats Pro','Tai nghe true wireless thể thao, pin đến 9h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH003.png',4690000),
  ('HPH','APLHPH010','Apple Beats Powerbeats','Tai nghe neckband thể thao, pin đến 15h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH001.png',1990000),
  ('HPH','APLHPH011','Apple Beats Studio Buds','Tai nghe true wireless chống ồn, pin case đến 24h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH002.png',2690000),
  ('HPH','APLHPH012','Apple Beats Solo3 Wireless','Tai nghe chụp tai Bluetooth, pin đến 40h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH003.png',3290000),
  ('HPH','APLHPH013','Apple Beats EP','Tai nghe chụp tai có dây, âm bass mạnh mẽ',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH001.png',990000),
  ('HPH','APLHPH014','Apple Beats Studio Buds+','Tai nghe true wireless, chống ồn, pin case đến 36h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH002.png',3290000),
  ('HPH','APLHPH015','Apple Beats Flex Essentials','Tai nghe neckband Bluetooth, pin đến 12h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH003.png',990000),
  ('HPH','APLHPH016','Apple Beats Pill+','Loa di động Bluetooth, pin đến 12h',100,'D:\Dai Hoc\Chuyen De Tot Nghiep\Graduate-Project\images\APLHPH001.png',2990000);