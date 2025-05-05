CREATE TABLE "products"
(
    "id"             integer PRIMARY KEY,
    "nameGE"         varchar2,
    "nameENG"        varchar2,
    "nameRUS"        varchar2,
    "descriptionGE"  varchar2,
    "descriptionENG" varchar2,
    "descriptionRUS" varchar2,
    "price" double,
    "stock_amount"   integer,
    "category_id"    integer,
    "image_id"       integer
);

CREATE TABLE "users"
(
    "id"             integer PRIMARY KEY,
    "name"           varchar2,
    "surname"        varchar2,
    "email"          varchar2,
    "password"       varchar2,
    "phone_number"   varchar2,
    "address"        varchar2,
    "city"           varchar2,
    "role"           varchar2,
    "favouriteItems" products[]
);

CREATE TABLE "category"
(
    "id"               integer PRIMARY KEY,
    "name"             varchar2,
    "description"      varchar2,
    "parentCategoryId" integer
);

CREATE TABLE "images"
(
    "id"        integer PRIMARY KEY,
    "name"      varchar2,
    "data"      binary,
    "file_path" varchar2
);

CREATE TABLE "authTokens"
(
    "id"           integer PRIMARY KEY,
    "user"         users,
    "accessToken"  varchar2,
    "refreshToken" varchar2
);

CREATE TABLE "dictionary"
(
    "id"    integer,
    "key"   varchar2,
    "value" varchar2
);

ALTER TABLE "products"
    ADD CONSTRAINT "product_category" FOREIGN KEY ("category_id") REFERENCES "category" ("id");

ALTER TABLE "products"
    ADD CONSTRAINT "product_image" FOREIGN KEY ("image_id") REFERENCES "images" ("id");

ALTER TABLE "authTokens"
    ADD CONSTRAINT "refreshToken_user" FOREIGN KEY ("user") REFERENCES "users" ("id");

ALTER TABLE "users"
    ADD CONSTRAINT "favourites" FOREIGN KEY ("favouriteItems") REFERENCES "products" ("id");

ALTER TABLE "category"
    ADD CONSTRAINT "category_subCatergory" FOREIGN KEY ("parentCategoryId") REFERENCES "category" ("id");
