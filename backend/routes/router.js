const express = require('express');
const router = express.Router();

const initOptions = {
  /* initialization options */
};
const pgp = require('pg-promise')(initOptions);

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'todos',
  user: 'postgres',
  password: 'postgres',
  max: 30 // use up to 30 connections
};

const db = pgp(cn);

// db.one(
//   'INSERT INTO categories VALUES(DEFAULT, $1, $2)',
//   ['garden', 'chores at garden'],
//   event => event.id
// ).then(data => {});

// db.one(
//   'INSERT INTO todos VALUES(DEFAULT, $1, $2)',
//   ['wash car', 'vaccuum and clean car'],
//   event => event.id
// ).then(data => {});

router.post('/todos', function(req, res) {
  const userInput = { ...req.body };
  db.one(
    'INSERT INTO todos VALUES(DEFAULT, $1, $2, $3) RETURNING id,title,body,category',
    [
      userInput.title,
      userInput.body,
      userInput.category ? userInput.category : null
    ],
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.get('/todos', function(req, res) {
  if (req.query && req.query.category) {
    db.any(
      `SELECT * FROM categories INNER JOIN todos ON (${req.query.category} = todos.category)`
    ).then(data => {
      res.json(data);
    });

    return;
  }

  db.any(`SELECT * FROM todos`).then(data => {
    res.json(data);
  });
});

router.put('/todos/:id', function(req, res) {
  const userInput = { ...req.body };
  db.one(
    `UPDATE todos SET ${userInput.title ? 'title=$1' : ''} ${
      (userInput.title && userInput.body) ||
      (userInput.title && userInput.category)
        ? ','
        : ''
    } ${userInput.body ? 'body=$2' : ''} ${
      userInput.body && userInput.category ? ',' : ''
    }${userInput.category ? 'category=$3' : ''} ${
      userInput.category && userInput.done ? ',' : ''
    } ${Object.keys(userInput).includes('done') ? 'done=$4' : ''} WHERE id=${
      req.params.id
    } RETURNING id,title,body,category,done`,
    [
      userInput.title,
      userInput.body,
      userInput.category ? userInput.category : null,
      userInput.done ? 'TRUE' : 'FALSE'
    ],
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.delete('/todos/:id', function(req, res) {
  db.one(
    `DELETE FROM todos WHERE id=${req.params.id} RETURNING id,title,body,category`,
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.get('/categories', function(req, res) {
  db.any('SELECT * FROM categories').then(data => {
    res.json(data);
  });
});

module.exports = router;
