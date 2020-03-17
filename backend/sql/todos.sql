DROP TABLE categories;
CREATE TABLE categories(
    id SERIAL NOT NULL PRIMARY KEY,
    category_name varchar(40)
);
-- DROP TABLE todos;
-- CREATE TABLE todos(
--     id SERIAL NOT NULL PRIMARY KEY,
--     title varchar(20),
--     body varchar(250),
--     category integer REFERENCES categories(id),
--     done BOOLEAN
-- );