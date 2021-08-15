const express = require('express');
const app = express();
const connection = require('./database/database');
const Question = require('./model/Question');
const Response = require('./model/Response');
const SequelizeOp = require('sequelize').Op;
const moment = require('moment');

// Connect database
connection.authenticate().then(() => {
  console.log('Success to connected!');
}).catch( (err) => {
  console.log('Error to connect. ', err);
});

// Config Express
app.use(express.json());
app.use(express.urlencoded({extended: false})); // Body Parser
app.use(express.static('public'));

app.set('view engine', 'ejs'); // Define View Engine

// Routes 

app.get('/', (req, res) => {
  let query = req.query.search;
  let search = `%${query}%`;
  let where = req.query.search != undefined ? { title: { [SequelizeOp.like]: search } } : {};
  Question.findAll({ where, raw: true, order: [ ['createdAt', 'DESC'] ] }).then( (questions) => {
    res.render('index', { questions });
  });
});

app.get('/quiz', (req, res) => {
  res.render('quiz');
});

app.post('/question-save', (req, res) => {
  const data = {
    title: req.body.title,
    description: req.body.description
  }
  Question.create(data).then(() => {
    console.log('LOG DATABASE: Success to create a <Question>');
    res.redirect('/');
  }).catch((err) => {
    console.log('Error to create <Question>.', err);
    res.redirect('/');
  });
});

app.get('/question/:id', async (req, res) => {
  let id = req.params.id;

  const question = await Question.findOne({ where: {id} } );
  if (question) {

    const responses = await Response.findAll({where: {question_fk: question.id}, raw: true, order: [ ['createdAt', 'DESC']] }) || [];
    let data = responses.map((response) => {
      return {
        ...response,
        date: moment(response.createdAt).format('DD/MM/YYYY')
      };
    });
    console.log(data);

    res.render('question', {question, responses : data });
  } else {
    res.redirect('/');
  }
});

app.post('/question/:id', (req, res) => {
  const data = {
    body: req.body.body,
    question_fk: req.body.id
  };

  console.log(data);

  Response.create(data).then(() => {
    console.log('LOG DATABASE: Success to create a <Response>');
    res.redirect(`/question/${req.params.id}`);
  }).catch( (err) => {
    console.log('Error to create <Response>.', err);
    res.redirect('/');
  });

});

app.get('*', (req, res) => {
  res.redirect('/');
});

const port = 4040;
app.listen(port, () => console.log("Server listening on 4040!"));