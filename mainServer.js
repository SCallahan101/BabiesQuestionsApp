"use strict";

const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();

mongoose.Promise = global.Promise;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('common'));



const posts_centerRouter = require('./posts_centerRouter')

app.use(express.json());
// app.use(bodyParser.json());

app.use(express.static('FrontMain'));

const {PORT, DATABASE_URL} = require("./config");


app.get('/', (req, res)=> {
  res.sendFile(_dirname + '/FrontMain/index.js');
});

app.use('/questionPost', posts_centerRouter);
// const { QuestionBoard } = require("./appModel");
//
// // mongoose.connect('mongodb://boardCreator619:board123@ds111025.mlab.com:11025/questionsboard', { useNewUrlParser: true }, function(err){
// // if(err){
// //   console.log(err);
// // }else {
// //   console.log('connected to database.');
// // }
// // });
//
//
//
// app.get("/questionPost", (req, res) => {
//   QuestionBoard
//   .find()
//   // .limit(8)
//   .then(questionPosts => {
//     res.json(
//       {
//       questionPosts: questionPosts.map(
//         (questionPost) => questionPost.serialize())
//     }
//   );
//
//   })
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({ message: "Something happened from app.get area"});
//   });
// });
//
// // app.get("/questionPost", (req, res) => {
// //   QuestionBoard
// //   .find()
// //   .limit(8)
// //   .then(post =>
// //     res.json({
// //       parentName: post.parentName,
// //       title: post.title,
// //       question: post.question.content
// //     }))
// //   .catch(err => {
// //     console.error(err);
// //     res.status(500).json({ message: "Something happened from app.get area"});
// //   });
// // });
//
// app.get("/questionPost/:id", (req, res) => {
//   QuestionBoard
//     .findById(req.params.id)
//     .then(questionPost => res.json(questionPost.serialize()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({message: "Something happened from app.get:id area"});
//     });
// });
//
// app.post("/questionPost", (req, res) => {
//   const requiredInputs = ["parentName", "title"];
//   for (let i=0; i< requiredInputs.length; i++) {
//     const input = requiredInputs[i];
//     if(!(input in req.body)) {
//       const message = `Missing \`${input}\` in request body`;
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//   QuestionBoard.create({
//     parentName: req.body.parentName,
//     title: req.body.title,
//     zipcode: req.body.zipcode,
//     question: req.body.question
//   })
//   .then(questionPost => res.status(201).json(questionPost.serialize()))
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({ message: "Something happened in app.post area"});
//   });
// });
//
// app.put("/questionPost/:id", (req, res) => {
//   if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     const message =
//     `Request path id (${req.params.id}) and request body id` + `(${req.body.id}) must match`;
//     console.error(message);
//     return res.status(400).json({message: message});
//   }
//   const toUpdate = {};
//   const updateableInputs = ["parentName", "title", "zipcode", "question"];
//
//   updateableInputs.forEach(input => {
//     if (input in req.body) {
//       toUpdate[input] = req.body[input];
//     }
//   });
//   QuestionBoard
//     .findByIdAndUpdate(req.params.id, {$set: toUpdate})
//     .then(questionPost => res.status(204).end())
//     .catch(err => res.status(500).json({message: "Something happened in app.put area"}));
// });
//
// app.delete("/questionPost/:id", (req, res) => {
//   QuestionBoard.findByIdAndRemove(req.params.id)
//   .then(questionPost => res.status(204).end())
//   .catch(err => res.status(500).json({message: "Something happened in app.delete area"}));
// });
//
// app.use("*", function(req, res) {
//   res.status(404).json({message: "Not Found"});
// });

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
