'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models');

const router =  express.Router();

const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
  //link this with the enter page
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  //link this with profile creation
  const stringFields = [ 'username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find( field => req.body[field].trim() !== req.body[field]);
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] &&
    req.body[field].trim().length > sizedFields[field].max
  );
  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
      ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
      : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }
  let {username, password, firstName = '', lastName = ''} = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
  .count()
  .then(count => {
    if(count > 0) {return Promise.reject({
      code: 422,
      reason: 'ValidationError',
      message: 'Username already taken',
      location: 'username'
    });
  }
  return User.hashPassword(password);
  })
  .then(hash => {
    return User.create({
      username,
      password: hash,
      firstName,
      lastName
    });
  })
  .then(user => {
    return res.status(201).json(user.serialize());
  })
  .catch(err => {
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({code: 500, message: 'Internal Server Error1'});
  });
});

router.get('/', (req, res) => {
  return User.find()
  .then(users => res.json(users.map(user => user.serialize())))
  .catch(err => res.status(500).json({message: 'Internal Server Error2'}));
});

//need to get it match to username to get user full name.

router.get("/singleUsername/:username", (req, res) => {
  console.log('username entered...')
     User
    .find({username: {$eq: req.params.username}})
    .then(dataUsername => {
      if(dataUsername){
        console.log(dataUsername);
        res.json(dataUsername)
    }
  }).catch(err => {
      console.error(err);
      res.status(500).json({message: "Something happened from app.get:username area"});
    });
});
module.exports = {router};
