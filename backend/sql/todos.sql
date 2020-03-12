CREATE TABLE categories(
    id SERIAL NOT NULL PRIMARY KEY,
    title varchar(20),
    body varchar(40)
);

CREATE TABLE todos(
    id SERIAL NOT NULL PRIMARY KEY,
    title varchar(20),
    body varchar(40),
    category integer REFERENCES categories(id)
);