"use strict";

const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");
const passport = require('passport');
require('dotenv').config();

const {router: usersRouter } = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');

mongoose.Promise = global.Promise;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('common'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    // res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);
// passport and jwt part
app.use('/api/users/', usersRouter);
// console.log(usersRouter);
app.use('/api/auth/', authRouter);
// console.log(authRouter);

const jwtAuth = passport.authenticate('jwt', {session: false});

app.get('/api/protected', jwtAuth, (req, res ) => {
  return res.json({
    data: 'nodeJWT'
  });
});

//----------------------------------------------

const posts_centerRouter = require('./posts_centerRouter')

app.use(express.json());


app.use(express.static('FrontMain'));

const {PORT, DATABASE_URL} = require("./config");


app.get('/', (req, res)=> {
  res.sendFile(_dirname + '/FrontMain/index.js');
});

app.use('/questionPost', posts_centerRouter);

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
module.exports = { app,
  // jwtAuth,
  runServer, closeServer};
