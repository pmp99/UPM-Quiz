var express = require('express');
var router = express.Router();
// const multer = require('multer')
// const multerConfig = {
//     storage: memory.diskStorage({
//         destination: (req, file, next) => {
//             next(null, './public/images')
//         },
//         filename: (req, file, next) => {
//             console.log(file)
//         }
//     }),
    
// }

const sessionController = require("../controllers/session");
const userController = require("../controllers/user");
const quizController = require("../controllers/quiz");
const preguntaController = require("../controllers/pregunta");
const alumnoController = require("../controllers/alumno");
const gameController = require("../controllers/game");

router.all('*', sessionController.deleteExpiredUserSession);

//-----------------------------------------------------------

//Rutas para Login y Logout
router.post('/login', sessionController.create);
router.delete('/logout', sessionController.destroy);

//Rutas relacionadas con usuario
router.post('/register', userController.createUser);
router.get('/admin/index', userController.index);
router.get('/admin/view/:id(\\d+)', sessionController.adminOrMyselfRequired, userController.viewUser);
router.get('/edit/:id(\\d+)', userController.editUser);
router.put('/edit/:id(\\d+)', userController.edit);
router.delete('/admin/delete/:id(\\d+)', userController.deleteUser);
router.get('/:id(\\d+)/user', userController.viewUser);

//Rutas relacionadas con un quiz
router.post('/user/newQuiz', quizController.createQuiz);
router.get('/view/quizzes/:id(\\d+)', quizController.index);
router.get('/quiz/:id(\\d+)/view', quizController.viewQuiz);
router.delete('/quiz/:id(\\d+)/delete', quizController.deleteQuiz);
router.put('/edit/quiz/:id(\\d+)', quizController.editQuiz);

//Rutas relacionadas con un game
router.post('/user/:userId(\\d+)/newGame/:quizId(\\d+)', gameController.createGame);
router.get('/game/check/:accessId(\\d+)', gameController.checkGame);
router.get('/game/:id(\\d+)/view', gameController.viewGame);
router.delete('/game/:id(\\d+)/delete', gameController.deleteGame);
router.get('/view/games/:id(\\d+)', gameController.index);
router.get('/view/gamesFromUser/:id(\\d+)', gameController.indexFromUser);
router.get('/view/gamesPlayed/:id(\\d+)', gameController.gamesPlayed);
router.put('/game/start/:id(\\d+)', gameController.startGame);
router.put('/game/end/:id(\\d+)', gameController.endGame);
router.put('/game/:id(\\d+)/toggleLock', gameController.toggleLockGame);

//Rutas reacionadas con preguntas
router.post('/new/question/:id(\\d+)', preguntaController.newQuestion);
router.get('/get/quiz/:quizId(\\d+)/question/:questionId(\\d+)', preguntaController.getQuestion);
router.delete('/quiz/:quizId(\\d+)/delete/question/:id(\\d+)', preguntaController.deleteQuestion);
router.put('/edit/question/:id(\\d+)', preguntaController.editQuestion);
router.put('/question/end', preguntaController.endQuestion);
router.get('/question/:id(\\d+)/answer/:quizId(\\d+)', preguntaController.getAnswer);

//Rutas reacionadas con un alumno
router.delete('/game/:gameId(\\d+)/delete/alumno/:id(\\d+)', alumnoController.deleteAlumno);
router.delete('/game/:gameId(\\d+)/delete/alumnoName/:name', alumnoController.deleteAlumnoByName);
router.post('/alumno/join', alumnoController.joinGame);
router.get('/alumno/check/:id(\\d+)', alumnoController.checkStarted);
router.put('/alumno/answer', alumnoController.score);
router.put('/alumno/score', alumnoController.getScore);
router.put('/alumno/:id(\\d+)/position', alumnoController.setPosition);

module.exports = router;