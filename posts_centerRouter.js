const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { QuestionBoard } = require("./appModel");

// mongoose.connect('mongodb://boardCreator619:board123@ds111025.mlab.com:11025/questionsboard', { useNewUrlParser: true }, function(err){
// if(err){
//   console.log(err);
// }else {
//   console.log('connected to database.');
// }
// });

// QuestionBoard.create('Uncle Tim', 'Falling Star', 99999, 'Why Cow can"t fall down');

router.get("/", (req, res) => {
  QuestionBoard
  .find()
  // .limit(8)
  .then(questionPosts => {
    res.json(
      {
      questionPosts: questionPosts.map(
        (questionPost) => questionPost.serialize())
    }
  );

  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Something happened from app.get area"});
  });
});

// app.get("/questionPost", (req, res) => {
//   QuestionBoard
//   .find()
//   .limit(8)
//   .then(post =>
//     res.json({
//       parentName: post.parentName,
//       title: post.title,
//       question: post.question.content
//     }))
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({ message: "Something happened from app.get area"});
//   });
// });

router.get("/:id", (req, res) => {
  QuestionBoard
    .findById(req.params.id)
    .then(questionPost => res.json(questionPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Something happened from app.get:id area"});
    });
});
//Shannon - keep your eyes on this section for confusing ajax callback
router.post("/", (req, res) => {
  const requiredInputs = ["parentName", "title"];
  for (let i=0; i< requiredInputs.length; i++) {
    const input = requiredInputs[i];
    if(!(input in req.body)) {
      const message = `Missing \`${input}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  QuestionBoard.create({
    parentName: req.body.parentName,
    title: req.body.title,
    zipcode: req.body.zipcode,
    question: req.body.question
  })
  .then(questionPost => res.status(201).json(questionPost.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Something happened in app.post area"});
  });
});

router.put("/:id", jsonParser, (req, res) => {
  if(req.params.id && req.body.id && req.params.id === req.body.id) {
    const message =
    `Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`;
    console.error(message);
    console.log(`${req.params.id} - ${req.body.id}`);
    return res.status(400).json({message: message});
  }
  const toUpdate = {};
  // const question = { "content", "childAge", "foundAnswer"};
  const updateableInputs = ["parentName", "title", "zipcode"];


  updateableInputs.forEach(input => {
    if (input in req.body) {
      toUpdate[input] = req.body[input];
    }
  });
  QuestionBoard
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(questionPost => res.status(204).end())
    .catch(err => res.status(500).json({message: "Something happened in app.put area"}));
});

router.delete("/:id", (req, res) => {
  QuestionBoard.findByIdAndRemove(req.params.id)
  .then(questionPost => res.status(204).end())
  .catch(err => res.status(500).json({message: "Something happened in app.delete area"}));
});

router.use("*", function(req, res) {
  res.status(404).json({message: "Not Found"});
});

module.exports = router;
