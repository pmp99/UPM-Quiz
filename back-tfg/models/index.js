const path = require('path');

// Load ORM
const Sequelize = require('sequelize');

// To use SQLite data base:
//    DATABASE_URL = sqlite:quiz.sqlite
// To use  Heroku Postgres data base:
//    DATABASE_URL = postgres://user:passwd@host:port/database

const url = process.env.DATABASE_URL || "sqlite:kahoot.sqlite";

const sequelize = new Sequelize(url);

sequelize.import(path.join(__dirname, 'pregunta'));

sequelize.import(path.join(__dirname, 'quiz'));

sequelize.import(path.join(__dirname,'user'));

sequelize.import(path.join(__dirname,'session'));

sequelize.import(path.join(__dirname, 'alumno'));

sequelize.import(path.join(__dirname, 'game'));

sequelize.import(path.join(__dirname, 'removedGame'));

// Relation between models

const {quiz, pregunta, user, alumno, game, removedGame} = sequelize.models;

user.hasMany(quiz, {foreingKey: 'userId'});
quiz.belongsTo(user, {as: 'user', foreingKey: 'userId'});

user.hasMany(removedGame, {foreingKey: 'userId'});

quiz.hasMany(pregunta, {foreingKey: 'quizId'});
pregunta.belongsTo(quiz, {as:'quiz', foreingKey: 'quizId'});

quiz.hasMany(game, {foreingKey: 'quizId'});
game.belongsTo(quiz, {as:'quiz', foreingKey: 'quizId'});

user.hasMany(game, {foreingKey: 'userId'});
game.belongsTo(user, {as:'user', foreingKey: 'userId'});

game.hasMany(alumno, {foreingKey: 'gameId'});

module.exports = sequelize;