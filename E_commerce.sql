/*==============================================================*/
/* DBMS name:      SAP SQL Anywhere 17                          */
/* Created on:     06/04/2025 9:57:58 CH                        */
/*==============================================================*/


if exists(select 1 from sys.sysforeignkey where role='FK_CART_CUSTOMER__CUSTOMER') then
    alter table CART
       delete foreign key FK_CART_CUSTOMER__CUSTOMER
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_CART_ITE_CART_CART_CART') then
    alter table CART_ITEM
       delete foreign key FK_CART_ITE_CART_CART_CART
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_CART_ITE_PRODUCT_C_PRODUCT') then
    alter table CART_ITEM
       delete foreign key FK_CART_ITE_PRODUCT_C_PRODUCT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_ORDER_USER_ORDE_CUSTOMER') then
    alter table "ORDER"
       delete foreign key FK_ORDER_USER_ORDE_CUSTOMER
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_ORDER_IT_ORDER_ORD_ORDER') then
    alter table ORDER_ITEM
       delete foreign key FK_ORDER_IT_ORDER_ORD_ORDER
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_ORDER_IT_PRODUCT_O_PRODUCT') then
    alter table ORDER_ITEM
       delete foreign key FK_ORDER_IT_PRODUCT_O_PRODUCT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_PAYMENT_ORDER_PAY_ORDER') then
    alter table PAYMENT
       delete foreign key FK_PAYMENT_ORDER_PAY_ORDER
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_PRODUCT_CATEGORY__CATEGORY') then
    alter table PRODUCT
       delete foreign key FK_PRODUCT_CATEGORY__CATEGORY
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_REVIEW_PRODUCT_R_PRODUCT') then
    alter table REVIEW
       delete foreign key FK_REVIEW_PRODUCT_R_PRODUCT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_REVIEW_USER_REVI_CUSTOMER') then
    alter table REVIEW
       delete foreign key FK_REVIEW_USER_REVI_CUSTOMER
end if;

drop index if exists CART.CUSTOMER_CART_FK;

drop index if exists CART.CART_PK;

drop table if exists CART;

drop index if exists CART_ITEM.PRODUCT_CARTITEM_FK;

drop index if exists CART_ITEM.CART_CARTITEM_FK;

drop index if exists CART_ITEM.CART_ITEM_PK;

drop table if exists CART_ITEM;

drop index if exists CATEGORY.CATEGORY_PK;

drop table if exists CATEGORY;

drop index if exists CUSTOMER.CUSTOMER_PK;

drop table if exists CUSTOMER;

drop index if exists EMPLOYEE.EMPLOYEE_PK;

drop table if exists EMPLOYEE;

drop index if exists "ORDER".USER_ORDER_FK;

drop index if exists "ORDER".ORDER_PK;

drop table if exists "ORDER";

drop index if exists ORDER_ITEM.PRODUCT_ORDERITEM_FK;

drop index if exists ORDER_ITEM.ORDER_ORDERITEM_FK;

drop index if exists ORDER_ITEM.ORDER_ITEM_PK;

drop table if exists ORDER_ITEM;

drop index if exists PAYMENT.ORDER_PAYMENT_FK;

drop index if exists PAYMENT.PAYMENT_PK;

drop table if exists PAYMENT;

drop index if exists PRODUCT.CATEGORY_PRODUCT_FK;

drop index if exists PRODUCT.PRODUCT_PK;

drop table if exists PRODUCT;

drop index if exists REVIEW.USER_REVIEW_FK;

drop index if exists REVIEW.PRODUCT_REVIEW_FK;

drop index if exists REVIEW.REVIEW_PK;

drop table if exists REVIEW;

/*==============================================================*/
/* Table: CART                                                  */
/*==============================================================*/
create or replace table CART 
(
   CART_ID              varchar(15)                    not null,
   USER_ID              varchar(20)                    null,
   CREATED_AT           timestamp                      not null,
   constraint PK_CART primary key clustered (CART_ID)
);

/*==============================================================*/
/* Index: CART_PK                                               */
/*==============================================================*/
create unique clustered index CART_PK on CART (
CART_ID ASC
);

/*==============================================================*/
/* Index: CUSTOMER_CART_FK                                      */
/*==============================================================*/
create index CUSTOMER_CART_FK on CART (
USER_ID ASC
);

/*==============================================================*/
/* Table: CART_ITEM                                             */
/*==============================================================*/
create or replace table CART_ITEM 
(
   CART_ID              varchar(15)                    not null,
   CATEGORY_ID          varchar(10)                    not null,
   PRODUCT_ID           varchar(10)                    not null,
   CART_ITEM_ID         varchar(10)                    not null,
   SOLDPRICE            integer                        null,
   QUANTITY             integer                        null,
   constraint PK_CART_ITEM primary key clustered (CATEGORY_ID, CART_ID, PRODUCT_ID, CART_ITEM_ID)
);

/*==============================================================*/
/* Index: CART_ITEM_PK                                          */
/*==============================================================*/
create unique clustered index CART_ITEM_PK on CART_ITEM (
CATEGORY_ID ASC,
CART_ID ASC,
PRODUCT_ID ASC,
CART_ITEM_ID ASC
);

/*==============================================================*/
/* Index: CART_CARTITEM_FK                                      */
/*==============================================================*/
create index CART_CARTITEM_FK on CART_ITEM (
CART_ID ASC
);

/*==============================================================*/
/* Index: PRODUCT_CARTITEM_FK                                   */
/*==============================================================*/
create index PRODUCT_CARTITEM_FK on CART_ITEM (
CATEGORY_ID ASC,
PRODUCT_ID ASC
);

/*==============================================================*/
/* Table: CATEGORY                                              */
/*==============================================================*/
create or replace table CATEGORY 
(
   CATEGORY_ID          varchar(10)                    not null,
   CATEGORY_NAME        varchar(50)                    not null,
   constraint PK_CATEGORY primary key clustered (CATEGORY_ID)
);

/*==============================================================*/
/* Index: CATEGORY_PK                                           */
/*==============================================================*/
create unique clustered index CATEGORY_PK on CATEGORY (
CATEGORY_ID ASC
);

/*==============================================================*/
/* Table: CUSTOMER                                              */
/*==============================================================*/
create or replace table CUSTOMER 
(
   USER_ID              varchar(20)                    not null,
   FULL_NAME            varchar(100)                   not null,
   EMAIL                varchar(100)                   not null,
   PSW                  varchar(50)                    not null,
   PHONE                varchar(15)                    null,
   CUSTOMERADDRESS      varchar(200)                   null,
   constraint PK_CUSTOMER primary key clustered (USER_ID)
);

/*==============================================================*/
/* Index: CUSTOMER_PK                                           */
/*==============================================================*/
create unique clustered index CUSTOMER_PK on CUSTOMER (
USER_ID ASC
);

/*==============================================================*/
/* Table: EMPLOYEE                                              */
/*==============================================================*/
create or replace table EMPLOYEE 
(
   EMPLOYEEID           varchar(10)                    not null,
   FIRSTNAME            varchar(50)                    null,
   LASTNAME             varchar(30)                    null,
   BIRTHDATE            date                           null,
   ADDRESS              varchar(200)                   null,
   IDCARD               varchar(15)                    null,
   ROLE                 integer                        null,
   constraint PK_EMPLOYEE primary key clustered (EMPLOYEEID)
);

/*==============================================================*/
/* Index: EMPLOYEE_PK                                           */
/*==============================================================*/
create unique clustered index EMPLOYEE_PK on EMPLOYEE (
EMPLOYEEID ASC
);

/*==============================================================*/
/* Table: "ORDER"                                               */
/*==============================================================*/
create or replace table "ORDER" 
(
   USER_ID              varchar(20)                    not null,
   ORDER_ID             varchar(15)                    not null,
   ORDER_DATE           timestamp                      not null,
   STATUS               varchar(10)                    not null,
   TOTAL_AMOUNT         integer                        not null,
   constraint PK_ORDER primary key clustered (USER_ID, ORDER_ID)
);

/*==============================================================*/
/* Index: ORDER_PK                                              */
/*==============================================================*/
create unique clustered index ORDER_PK on "ORDER" (
USER_ID ASC,
ORDER_ID ASC
);

/*==============================================================*/
/* Index: USER_ORDER_FK                                         */
/*==============================================================*/
create index USER_ORDER_FK on "ORDER" (
USER_ID ASC
);

/*==============================================================*/
/* Table: ORDER_ITEM                                            */
/*==============================================================*/
create or replace table ORDER_ITEM 
(
   USER_ID              varchar(20)                    not null,
   ORDER_ID             varchar(15)                    not null,
   CATEGORY_ID          varchar(10)                    not null,
   PRODUCT_ID           varchar(10)                    not null,
   ORDER_ITEM_ID        varchar(10)                    not null,
   ORDERPRICE           integer                        not null,
   ORDERQUANTITY        integer                        null,
   constraint PK_ORDER_ITEM primary key clustered (CATEGORY_ID, USER_ID, ORDER_ID, PRODUCT_ID, ORDER_ITEM_ID)
);

/*==============================================================*/
/* Index: ORDER_ITEM_PK                                         */
/*==============================================================*/
create unique clustered index ORDER_ITEM_PK on ORDER_ITEM (
CATEGORY_ID ASC,
USER_ID ASC,
ORDER_ID ASC,
PRODUCT_ID ASC,
ORDER_ITEM_ID ASC
);

/*==============================================================*/
/* Index: ORDER_ORDERITEM_FK                                    */
/*==============================================================*/
create index ORDER_ORDERITEM_FK on ORDER_ITEM (
USER_ID ASC,
ORDER_ID ASC
);

/*==============================================================*/
/* Index: PRODUCT_ORDERITEM_FK                                  */
/*==============================================================*/
create index PRODUCT_ORDERITEM_FK on ORDER_ITEM (
CATEGORY_ID ASC,
PRODUCT_ID ASC
);

/*==============================================================*/
/* Table: PAYMENT                                               */
/*==============================================================*/
create or replace table PAYMENT 
(
   PAYMENT_ID           varchar(10)                    not null,
   USER_ID              varchar(20)                    null,
   ORDER_ID             varchar(15)                    null,
   PAYMENT_METHOD       varchar(50)                    not null,
   PAYMENT_DATE         timestamp                      not null,
   PAYMENT_STATUS       varchar(50)                    not null,
   constraint PK_PAYMENT primary key clustered (PAYMENT_ID)
);

/*==============================================================*/
/* Index: PAYMENT_PK                                            */
/*==============================================================*/
create unique clustered index PAYMENT_PK on PAYMENT (
PAYMENT_ID ASC
);

/*==============================================================*/
/* Index: ORDER_PAYMENT_FK                                      */
/*==============================================================*/
create index ORDER_PAYMENT_FK on PAYMENT (
USER_ID ASC,
ORDER_ID ASC
);

/*==============================================================*/
/* Table: PRODUCT                                               */
/*==============================================================*/
create or replace table PRODUCT 
(
   CATEGORY_ID          varchar(10)                    not null,
   PRODUCT_ID           varchar(10)                    not null,
   PRODUCT_NAME         varchar(50)                    not null,
   DESCRIPTION          varchar(200)                   null,
   STOCK_QUANTITY       integer                        not null,
   IMAGE                varchar(50)                    null,
   PRICE                integer                        null,
   constraint PK_PRODUCT primary key clustered (CATEGORY_ID, PRODUCT_ID)
);

/*==============================================================*/
/* Index: PRODUCT_PK                                            */
/*==============================================================*/
create unique clustered index PRODUCT_PK on PRODUCT (
CATEGORY_ID ASC,
PRODUCT_ID ASC
);

/*==============================================================*/
/* Index: CATEGORY_PRODUCT_FK                                   */
/*==============================================================*/
create index CATEGORY_PRODUCT_FK on PRODUCT (
CATEGORY_ID ASC
);

/*==============================================================*/
/* Table: REVIEW                                                */
/*==============================================================*/
create or replace table REVIEW 
(
   CATEGORY_ID          varchar(10)                    not null,
   PRODUCT_ID           varchar(10)                    not null,
   USER_ID              varchar(20)                    not null,
   REVIEW_ID            varchar(10)                    not null,
   RATING               integer                        not null,
   "COMMENT"            varchar(200)                   null,
   REVIEW_DATE          timestamp                      null,
   constraint PK_REVIEW primary key clustered (CATEGORY_ID, PRODUCT_ID, USER_ID, REVIEW_ID)
);

/*==============================================================*/
/* Index: REVIEW_PK                                             */
/*==============================================================*/
create unique clustered index REVIEW_PK on REVIEW (
CATEGORY_ID ASC,
PRODUCT_ID ASC,
USER_ID ASC,
REVIEW_ID ASC
);

/*==============================================================*/
/* Index: PRODUCT_REVIEW_FK                                     */
/*==============================================================*/
create index PRODUCT_REVIEW_FK on REVIEW (
CATEGORY_ID ASC,
PRODUCT_ID ASC
);

/*==============================================================*/
/* Index: USER_REVIEW_FK                                        */
/*==============================================================*/
create index USER_REVIEW_FK on REVIEW (
USER_ID ASC
);

alter table CART
   add constraint FK_CART_CUSTOMER__CUSTOMER foreign key (USER_ID)
      references CUSTOMER (USER_ID)
      on update restrict
      on delete restrict;

comment on foreign key CART.FK_CART_CUSTOMER__CUSTOMER is 
'M?i ngu?i dùng có duy nh?t m?t gi? hàng.';

alter table CART_ITEM
   add constraint FK_CART_ITE_CART_CART_CART foreign key (CART_ID)
      references CART (CART_ID)
      on update restrict
      on delete restrict;

comment on foreign key CART_ITEM.FK_CART_ITE_CART_CART_CART is 
'M?t gi? hàng ch?a nhi?u m?c; m?i m?c gi? hàng liên k?t v?i m?t gi? hàng c? th?.';

alter table CART_ITEM
   add constraint FK_CART_ITE_PRODUCT_C_PRODUCT foreign key (CATEGORY_ID, PRODUCT_ID)
      references PRODUCT (CATEGORY_ID, PRODUCT_ID)
      on update restrict
      on delete restrict;

comment on foreign key CART_ITEM.FK_CART_ITE_PRODUCT_C_PRODUCT is 
'M?t s?n ph?m có th? du?c thêm vào nhi?u m?c trong gi? hàng; m?i m?c gi? hàng ch?a thông tin s?n ph?m c? th?.';

alter table "ORDER"
   add constraint FK_ORDER_USER_ORDE_CUSTOMER foreign key (USER_ID)
      references CUSTOMER (USER_ID)
      on update restrict
      on delete restrict;

comment on foreign key "ORDER".FK_ORDER_USER_ORDE_CUSTOMER is 
'M?t ngu?i dùng (khách hàng) có th? d?t nhi?u don hàng; m?i don hàng ch? thu?c v? 1 ngu?i dùng.';

alter table ORDER_ITEM
   add constraint FK_ORDER_IT_ORDER_ORD_ORDER foreign key (USER_ID, ORDER_ID)
      references "ORDER" (USER_ID, ORDER_ID)
      on update restrict
      on delete restrict;

comment on foreign key ORDER_ITEM.FK_ORDER_IT_ORDER_ORD_ORDER is 
'M?t don hàng bao g?m nhi?u m?c chi ti?t; m?i m?c chi ti?t liên k?t v?i 1 don hàng.
';

alter table ORDER_ITEM
   add constraint FK_ORDER_IT_PRODUCT_O_PRODUCT foreign key (CATEGORY_ID, PRODUCT_ID)
      references PRODUCT (CATEGORY_ID, PRODUCT_ID)
      on update restrict
      on delete restrict;

comment on foreign key ORDER_ITEM.FK_ORDER_IT_PRODUCT_O_PRODUCT is 
'M?t s?n ph?m có th? xu?t hi?n trong nhi?u m?c chi ti?t don hàng; m?i m?c chi ti?t d?i di?n cho m?t s?n ph?m c? th?.';

alter table PAYMENT
   add constraint FK_PAYMENT_ORDER_PAY_ORDER foreign key (USER_ID, ORDER_ID)
      references "ORDER" (USER_ID, ORDER_ID)
      on update restrict
      on delete restrict;

comment on foreign key PAYMENT.FK_PAYMENT_ORDER_PAY_ORDER is 
'M?i don hàng có 1 giao d?ch thanh toán; m?i giao d?ch thanh toán ch? liên k?t v?i 1 don hàng.';

alter table PRODUCT
   add constraint FK_PRODUCT_CATEGORY__CATEGORY foreign key (CATEGORY_ID)
      references CATEGORY (CATEGORY_ID)
      on update restrict
      on delete restrict;

comment on foreign key PRODUCT.FK_PRODUCT_CATEGORY__CATEGORY is 
'M?t danh m?c ch?a nhi?u s?n ph?m; m?i s?n ph?m thu?c v? 1 danh m?c.';

alter table REVIEW
   add constraint FK_REVIEW_PRODUCT_R_PRODUCT foreign key (CATEGORY_ID, PRODUCT_ID)
      references PRODUCT (CATEGORY_ID, PRODUCT_ID)
      on update restrict
      on delete restrict;

comment on foreign key REVIEW.FK_REVIEW_PRODUCT_R_PRODUCT is 
'M?t s?n ph?m có th? nh?n nhi?u dánh giá; m?i dánh giá liên k?t v?i 1 s?n ph?m.';

alter table REVIEW
   add constraint FK_REVIEW_USER_REVI_CUSTOMER foreign key (USER_ID)
      references CUSTOMER (USER_ID)
      on update restrict
      on delete restrict;

comment on foreign key REVIEW.FK_REVIEW_USER_REVI_CUSTOMER is 
'M?t ngu?i dùng có th? vi?t nhi?u dánh giá; m?i dánh giá ch? du?c vi?t b?i 1 ngu?i dùng.';

