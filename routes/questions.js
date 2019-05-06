const express = require('express');
const mongoose = require('mongoose');
const Question = require("../models/question");

const router = express.Router();

router.get("/questions", (req, res) => {
  Question
  .find()
  // .limit(8)
  .then(questions => {
    res.json(
      {
      questions: questions.map(
        (question) => question.serialize())
    }
  );

  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Something happened from router.get area"});
  });
});

router.get("/questions/:id", (req, res) => {
  Question
    .findById(req.params.id)
    .then(question => res.json(question.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Something happened from router.get:id area"});
    });
});

router.post("/questions", (req, res) => {
  const requiredInputs = ["parentName", "title"];
  for (let i=0; i< requiredInputs.length; i++) {
    const input = requiredInputs[i];
    if(!(input in req.body)) {
      const message = `Missing \`${input}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Question.create({
    parentName: req.body.parentName,
    title: req.body.title,
    zipcode: req.body.zipcode,
    question: req.body.question
  })
  .then(question => res.status(201).json(question.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Something happened in router.post area"});
  });
});

router.put("/questions/:id", (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
    `Request path id (${req.params.id}) and request body id` + `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableInputs = ["parentName", "title", "zipcode", "question"];

  updateableInputs.forEach(input => {
    if (input in req.body) {
      toUpdate[input] = req.body[input];
    }
  });
  Question
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(question => res.status(204).end())
    .catch(err => res.status(500).json({message: "Something happened in router.put area"}));
});

router.delete("/questions/:id", (req, res) => {
  Question.findByIdAndRemove(req.params.id)
  .then(question => res.status(204).end())
  .catch(err => res.status(500).json({message: "Something happened in router.delete area"}));
});

module.exports = router;
