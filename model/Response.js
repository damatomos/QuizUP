const Sequelize = require('sequelize');
const connection = require('../database/database');

const Response = connection.define('response', {
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  question_fk: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

Response.sync({force: false}).then(() => console.log('LOG DATABASE: Successful to Create <Response> Table'));

module.exports = Response;