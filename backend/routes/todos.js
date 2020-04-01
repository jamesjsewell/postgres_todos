const express = require('express');
const router = express.Router();
const db = require('../db');
const pgp = require('pg-promise')()

router.post('/', function (req, res) {
  const userInput = { ...req.body };
  db.one(
    'INSERT INTO todos VALUES(DEFAULT, $1, $2, $3) RETURNING id,title,body,category',
    [userInput.title, userInput.body, Number(userInput.category)],
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.get('/', function (req, res) {
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

router.put('/:id', function (req, res) {
  let userInput = { ...req.body };
  userInput.category = Number(req.body.category)

  const query = pgp.helpers.update(userInput, Object.keys(userInput), 'todos') + `WHERE id = ${req.params.id}`

  db.one(
    `${query} RETURNING id,title,body,category,done`,
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.delete('/:id', function (req, res) {
  db.one(
    `DELETE FROM todos WHERE id=${req.params.id} RETURNING id,title,body,category`,
    event => event
  ).then(data => {
    res.json(data);
  });
});

module.exports = router;
