CREATE TABLE "products" (
  "id" integer PRIMARY KEY,
  "name" varchar2,
  "decription" varchar2,
  "price" double,
  "stock_amount" integer,
  "category_id" integer,
  "image_id" integer
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "name" varchar2,
  "surname" varchar2,
  "email" varchar2,
  "salt" varchar2,
  "passwordHash" varchar2,
  "phone_number" varchar2,
  "address" varchar2,
  "role" varchar2
);

CREATE TABLE "category" (
  "id" integer PRIMARY KEY,
  "name" varchar2,
  "description" varchar2
);

CREATE TABLE "images" (
  "id" integer PRIMARY KEY,
  "name" varchar2,
  "data" binary,
  "file_path" varchar2
);

ALTER TABLE "products" ADD CONSTRAINT "product_category" FOREIGN KEY ("category_id") REFERENCES "category" ("id");

ALTER TABLE "products" ADD CONSTRAINT "product_image" FOREIGN KEY ("image_id") REFERENCES "images" ("id");
