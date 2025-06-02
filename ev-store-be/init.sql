CREATE TABLE products
(
    id              SERIAL PRIMARY KEY,
    name_ge         VARCHAR(255),
    name_eng        VARCHAR(255),
    name_rus        VARCHAR(255),
    description_ge  TEXT,
    description_eng TEXT,
    description_rus TEXT,
    price           DOUBLE PRECISION,
    stock_amount    INTEGER,
    category_id     INTEGER,
    image_name      VARCHAR(255),
    image_file_path VARCHAR(512)
);


CREATE TABLE users
(
    id                          SERIAL PRIMARY KEY,
    first_name                  VARCHAR(255),
    last_name                   VARCHAR(255),
    email                       VARCHAR(255) NOT NULL UNIQUE,
    mobile                      VARCHAR(255),
    address                     VARCHAR(255),
    city                        VARCHAR(255),
    personal_id_code            VARCHAR(255),
    password                    VARCHAR(255) NOT NULL,
    role                        VARCHAR(50),
    verification_code           VARCHAR(255),
    otp_verification_expiration TIMESTAMP,
    verified                    BOOLEAN,
    createdAt                   TIMESTAMP
);
CREATE TABLE user_favourites
(
    user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE category
(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255),
    description     TEXT,
    parent_category INTEGER REFERENCES category (id) ON DELETE SET NULL
);

CREATE TABLE images
(
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(255),
    file_path VARCHAR(1024),
    image     BYTEA
);

CREATE TABLE auth_tokens
(
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER UNIQUE REFERENCES users (id),
    access_token  varchar(400),
    refresh_token varchar(400)
);

CREATE TABLE dictionary
(
    id    SERIAL PRIMARY KEY,
    key   VARCHAR(255),
    value VARCHAR(255)
);

ALTER TABLE products
    ADD CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category (id);

-- ALTER TABLE products
--     ADD CONSTRAINT fk_product_image FOREIGN KEY (image_entity_id) REFERENCES images (id);

ALTER TABLE auth_tokens
    ADD CONSTRAINT fk_auth_token_user FOREIGN KEY (user_id) REFERENCES users (id);


