const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', function(req, res) {
  const userInput = { ...req.body };
  db.one(
    'INSERT INTO categories VALUES(DEFAULT, $1) RETURNING id,category_name',
    [userInput.category_name],
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.get('/', function(req, res) {
  db.any(`SELECT * FROM categories`).then(data => {
    res.json(data);
  });
});

router.put('/:id', function(req, res) {
  const userInput = { ...req.body };
  db.one(
    `UPDATE categories SET ${userInput.todo ? 'title=$1' : ''} ${
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
    } RETURNING id,category_name`,
    [userInput.category_name],
    event => event
  ).then(data => {
    res.json(data);
  });
});

router.delete('/:id', function(req, res) {
  db.one(
    `DELETE FROM todos WHERE id=${req.params.id} RETURNING id,title,body,category`,
    event => event
  ).then(data => {
    res.json(data);
  });
});

module.exports = router;
