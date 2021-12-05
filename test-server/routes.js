'use strict';
const express = require('express');
const router = express.Router();
const users = require('./data').users;
const giftcards = require('./data').giftcards;
const {
  authenticate,
  hashPass,
  uniqueEmail,
  createToken,
  findUser,
  validPass,
} = require('./utils');

router.post('/users/register', uniqueEmail, hashPass, (req, res) => {
 
  let newUser = {
    _id: Date.now(),
    email: req.body.email,
    password: req.body.hashedPassword,
  };
  users.push(newUser);
  res.status(201).send({ data: { _id: newUser._id, email: newUser.email } });
});

router.post('/users/tokens', findUser, validPass, (req, res) => {
  let token = createToken(req.user._id);
  res.status(200).send({ data: { token } });
});

router.get('/giftcards', authenticate, (req, res) => {
  let userGiftcards = giftcards.filter(
    (giftcards) => giftcards.owner === parseInt(req.user._id)
  );
  res.status(200).send({ data: userGiftcards });
});

router.get('/giftcards/:id', authenticate, (req, res) => {
  let giftcardsID = req.params.id;
  let giftcardsMatch = giftcards.find(
    (giftcards) => giftcards._id === giftcardsID && giftcards.owner === parseInt(req.user._id)
  );
  console.log(giftcardsID, req.user._id);
  if (giftcardsMatch) {
    res.status(200).send({ data: giftcardsMatch });
  } else {
    res.status(400).send({
      error: { code: 147, message: 'No match for specified giftcards id.' },
    });
  }
});

router.post('/giftcards', authenticate, (req, res) => {
  let newgiftcards = {
    _id: [...Array(30)]
      .map((e) => ((Math.random() * 36) | 0).toString(36))
      .join(''),
    vendor: req.body.vendor,
    amount: req.body.amount,
    owner: parseInt(req.user._id),
  };
  giftcards.push(newgiftcards);
  res.status(201).send({
    data: { _id: newgiftcards._id, vendor: newgiftcards.vendor, amount: newgiftcards.amount },
  });
});

router.delete('/giftcards/:id', authenticate, (req, res) => {

  let giftcardsID = req.params.id;
  let idx = giftcards.findIndex(
    (giftcards) => giftcards._id === giftcardsID && giftcards.owner === parseInt(req.user._id)
  );
  if (idx > -1) {
    giftcards.splice(idx, 1);
    res.status(200).send({ data: { _id: giftcardsID, message: 'Delete Success' } });
  } else {
    res.status(400).send({ error: { code: 258, message: 'Invalid giftcards id' } });
  }
});

module.exports = router;
