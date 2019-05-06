"use strict";
require('dotenv').config();
const express = require("express");
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const app = express();
app.use(morgan('common'));
app.use(express.json());

app.use(express.static('public'));

const { PORT, DATABASE_URL} = require("./config");
const localStrategy = require('./auth/local');
const jwtStrategy = require('./auth/jwt');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const questionsRouter = require('./routes/questions');

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

app.use('/api/questions', jwtAuth, questionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/', authRouter);

app.use("*", function(req, res) {
  res.status(404).json({message: "Not Found"});
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
if(require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}
module.exports = { app, runServer, closeServer};
