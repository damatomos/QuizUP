const Sequelize = require('sequelize');
                                // name BD, user, password
const connection = new Sequelize('quiz_up', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;