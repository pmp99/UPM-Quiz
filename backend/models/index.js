const path = require('path');

// Load ORM
const Sequelize = require('sequelize');

// To use SQLite data base:
//    DATABASE_URL = sqlite:quiz.sqlite
// To use  Heroku Postgres data base:
//    DATABASE_URL = postgres://user:passwd@host:port/database

const url = process.env.DATABASE_URL || "sqlite:upmquiz.sqlite";

const sequelize = new Sequelize(url);

sequelize.import(path.join(__dirname, 'question'));

sequelize.import(path.join(__dirname, 'quiz'));

sequelize.import(path.join(__dirname,'user'));

sequelize.import(path.join(__dirname, 'player'));

sequelize.import(path.join(__dirname, 'game'));

sequelize.import(path.join(__dirname, 'removedGame'));

sequelize.import(path.join(__dirname, 'removedQuiz'));

// Relation between models

const {quiz, question, user, player, game, removedGame, removedQuiz} = sequelize.models;

user.hasMany(quiz, {foreingKey: 'userId'});
quiz.belongsTo(user, {as: 'user', foreingKey: 'userId'});

user.hasMany(removedGame, {foreingKey: 'userId'});
removedGame.belongsTo(user, {as: 'user', foreingKey: 'userId', onDelete: 'cascade'});

user.hasMany(removedQuiz, {foreingKey: 'userId'});
removedQuiz.belongsTo(user, {as: 'user', foreingKey: 'userId', onDelete: 'cascade'});

quiz.hasMany(question, {foreingKey: 'quizId'});
question.belongsTo(quiz, {as:'quiz', foreingKey: 'quizId'});

quiz.hasMany(game, {foreingKey: 'quizId'});
game.belongsTo(quiz, {as:'quiz', foreingKey: 'quizId'});

game.hasMany(player, {foreingKey: 'gameId'});
player.belongsTo(game, {as:'game', foreingKey: 'gameId'});

user.hasMany(player, {foreingKey: 'userId'});
player.belongsTo(user, {as:'user', foreingKey: 'userId'});

module.exports = sequelize;