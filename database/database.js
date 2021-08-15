const Sequelize = require('sequelize');
                                // name BD, user, password
const connection = new Sequelize('quizup', 'root', 'shimoko123', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;