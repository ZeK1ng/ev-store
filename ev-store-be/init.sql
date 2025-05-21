CREATE TABLE products (
                          id SERIAL PRIMARY KEY,
                          name_ge VARCHAR(255),
                          name_eng VARCHAR(255),
                          name_rus VARCHAR(255),
                          description_ge TEXT,
                          description_eng TEXT,
                          description_rus TEXT,
                          price DOUBLE PRECISION,
                          stock_amount INTEGER,
                          category_id INTEGER,
                          image_name VARCHAR(255),
                          image_file_path VARCHAR(512)
);


CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name TEXT,
                       surname TEXT,
                       email TEXT,
                       password TEXT,
                       phone_number TEXT,
                       address TEXT,
                       city TEXT,
                       role TEXT,
                       favouriteItems INTEGER[]  -- array of product IDs
);

CREATE TABLE category (
                          id SERIAL PRIMARY KEY,
                          name TEXT,
                          description TEXT,
                          parentCategoryId INTEGER
);

CREATE TABLE images (
                        id SERIAL PRIMARY KEY,
                        name TEXT,
                        data BYTEA,
                        file_path TEXT
);

CREATE TABLE authTokens (
                            id SERIAL PRIMARY KEY,
                            user_id INTEGER,
                            accessToken TEXT,
                            refreshToken TEXT
);

CREATE TABLE dictionary (
                            id SERIAL,
                            key TEXT,
                            value TEXT
);

ALTER TABLE products
    ADD CONSTRAINT product_category FOREIGN KEY (category_id) REFERENCES category (id);

ALTER TABLE products
    ADD CONSTRAINT product_image FOREIGN KEY (image_id) REFERENCES images (id);

ALTER TABLE authTokens
    ADD CONSTRAINT refreshToken_user FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE category
    ADD CONSTRAINT category_subCategory FOREIGN KEY (parentCategoryId) REFERENCES category (id);
