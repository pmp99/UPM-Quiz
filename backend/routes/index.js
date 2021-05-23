const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()

const userController = require("../controllers/user");
const quizController = require("../controllers/quiz");
const questionController = require("../controllers/question");
const playerController = require("../controllers/player");
const gameController = require("../controllers/game");

//-----------------------------------------------------------

//Rutas relacionadas con USERS
router.post('/user/login', userController.login);
router.get('/user/getUsers', userController.getUsers);
router.delete('/user/delete/:userId(\\d+)', userController.deleteUser);

//Rutas relacionadas con QUIZZES
router.post('/quiz/createQuiz/:userId(\\d+)', quizController.createQuiz);
router.get('/quiz/getQuizzes/:userId(\\d+)', quizController.getQuizzes);
router.get('/quiz/getQuiz/:quizId(\\d+)', quizController.getQuiz);
router.delete('/quiz/delete/:quizId(\\d+)', quizController.deleteQuiz);
router.put('/quiz/editQuiz/:userId(\\d+)', quizController.editQuiz);
router.get('/removedQuiz/get/:userId(\\d+)', quizController.getRemovedQuizzes);
router.post('/removedQuiz/add/:userId(\\d+)/:quizId(\\d+)', quizController.addRemovedQuizzes);

//Rutas relacionadas con GAMES
router.post('/game/createGame/:quizId(\\d+)', gameController.createGame);
router.get('/game/check/:accessId(\\d+)', gameController.checkGame);
router.get('/game/getGame/:gameId(\\d+)', gameController.getGame);
router.delete('/game/delete/:gameId(\\d+)', gameController.deleteGame);
router.get('/game/getGames/:userId(\\d+)', gameController.getGames);
router.get('/game/getGamesPlayed/:userId(\\d+)', gameController.getGamesPlayed);
router.put('/game/setStatus/:gameId(\\d+)', gameController.setStatus);
router.put('/game/toggleLock/:gameId(\\d+)', gameController.toggleLockGame);
router.get('/removedGame/get/:userId(\\d+)', gameController.getRemovedGames);
router.post('/removedGame/add/:userId(\\d+)/:gameId(\\d+)', gameController.addRemovedGames);
router.get('/game/getGamePlayersUser/:gameId(\\d+)', gameController.getGamePlayersUser);
router.get('/game/checkPlaying/:userId(\\d+)', gameController.checkPlaying);
router.get('/game/checkPlayingNoLogin/:gameId(\\d+)/:nickname', gameController.checkPlayingNoLogin);

//Rutas relacionadas con QUESTIONS
router.post('/question/createQuestion/:quizId(\\d+)', questionController.createQuestion);
router.get('/question/getQuestion/:questionId(\\d+)', questionController.getQuestion);
router.delete('/question/delete/:questionId(\\d+)', questionController.deleteQuestion);
router.put('/question/editQuestion/:questionId(\\d+)', questionController.editQuestion);
router.put('/question/editQuestionImage/:questionId(\\d+)', upload.single('file'), questionController.editImageQuestion);

//Rutas relacionadas con PLAYERS
router.delete('/player/delete/:playerId(\\d+)', playerController.deletePlayer);
router.delete('/player/delete/:name/game/:gameId(\\d+)', playerController.deletePlayerByName);
router.post('/player/join', playerController.joinGame);
router.put('/player/setScore', playerController.setScore);
router.get('/player/getPlayer/:gameId(\\d+)/:nickname', playerController.getPlayer);
router.put('/player/setPosition/:playerId(\\d+)', playerController.setPosition);

module.exports = router;