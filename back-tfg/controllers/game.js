const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');

exports.createGame = (req, res, next) => {
    const quizId = req.params.quizId;
    const userId = req.params.userId;
    const {assignmentId, courseId, min, max} = req.body
    let accessId = 0;
    let juego = null;
    // Nos aseguramos de que el juego creado tenga un PIN de acceso
    // que no esté en uso y de que sea distinto de 0
    do {
        accessId = Math.floor(Math.random() * 10000);
        models.game.findOne({where: {accessId: accessId}})
            .then(game => {
                juego = game
            })
    } while (accessId === 0 || juego !== null)

    models.quiz.findByPk(quizId, {include: [models.pregunta]})
        .then(quiz => {
            let name = quiz.name
            let nQuestions = quiz.pregunta.length
            const game = models.game.build({
                userId: userId,
                quizId: quizId,
                accessId: accessId,
                quizName: name,
                nQuestions: nQuestions,
                courseId: courseId,
                assignmentId: assignmentId,
                min: min,
                max: max
            })
            quiz.timesPlayed += 1
            quiz.save({fields: ["timesPlayed"]})
                .then(() => {
                    game.save()
                        .then(game => {
                            res.send(game)
                        })
                        .catch(error => next(error))
                })
        })
}

exports.index = (req, res, next) => {
    const id = req.params.id;
    models.quiz.findByPk(id)
        .then(quiz => {
            const quizId = quiz.id;
            models.game.findAll({where: {quizId}, include: [models.alumno, {model: models.user, as: 'user'}]})
                .then(games => {
                    res.send(games)
                })
        })
        .catch(error => next(error))
};

exports.indexFromUser = (req, res, next) => {
    const userId = req.params.id;
    models.game.findAll({where: {userId: userId}, include: [models.alumno, {model: models.user, as: 'user'}]})
        .then(games => {
            res.send(games)
        })
        .catch(error => next(error))
};

exports.gamesPlayed = (req, res, next) => {
    const userId = req.params.id;
    models.alumno.findAll({where: {userId: userId}})
        .then(alumnos => {
            let ids = []
            alumnos.map((alumno) => {
                ids.push(alumno.gameId)
            })
            models.game.findAll({where: {id: ids}, include: [models.alumno, {model: models.user, as: 'user'}]})
                .then(games => {
                    res.send(games)
                })
        })
        .catch(error => next(error))
};


exports.startGame = (req, res, next) => {
    const id = req.params.id;
    models.game.findByPk(id, {include: [models.alumno, {model: models.user, as: 'user'}]})
        .then(game => {
            game.started = true;
            game.save()
            res.send(game)
        })
        .catch(error => next(error))
}


exports.checkGame = (req, res, next) => {
    const accessId = req.params.accessId;
    models.game.findOne({where: {accessId: accessId}, include: [models.alumno, {model: models.user, as: 'user'}]})
        .then(game => {
            if(game === null){
                res.send(false)
            }else{
                res.send(game)
            }
        })
        .catch(error => {
            next(error)
        })
}


exports.endGame = (req, res, next) => {
    const gameId = req.params.id
    models.game.findByPk(gameId, {include: [models.alumno, {model: models.user, as: 'user'}]})
        .then(game => {
            game.started = false
            game.accessId = 0
            game.save()
            res.send(game)
        })
}

exports.toggleLockGame = (req, res, next) => {
    const gameId = req.params.id
    models.game.findByPk(gameId, {include: [models.alumno, {model: models.user, as: 'user'}]})
        .then(game => {
            let locked = game.locked
            game.locked = !locked
            game.save()
            res.send(game)
        })
}


exports.viewGame = (req, res, next) => {
    const gameId = req.params.id;
    models.game.findByPk(gameId, {include: [models.alumno, {model: models.user, as: 'user'}]})
        .then(game => {
            res.send(game)
        })
        .catch(error => next(error))
}

exports.deleteGame = (req, res, next) => {
    const gameId = req.params.id;
    models.game.findByPk(gameId)
        .then(game => {
            game.destroy()
            models.alumno.destroy({where: {gameId: game.id}})
            models.game.findAll({include: [models.alumno, {model: models.user, as: 'user'}]})
                .then(games => {
                    res.send(games)
                })
        })
        .catch(error => next(error))
}

exports.getGamesRemoved = (req, res, next) => {
    const userId = req.params.id;
    models.removedGame.findAll({where: {userId: userId}})
        .then(games => {
            res.send(games)
        })
        .catch(error => next(error))
}

exports.addGamesRemoved = (req, res, next) => {
    const userId = req.params.userId;
    const gameId = req.params.gameId;
    const game = models.removedGame.build({
        userId: userId,
        gameId: gameId
    })
    game.save()
        .then(() => {
            models.removedGame.findAll({where: {userId: userId}})
                .then(games => {
                    res.send(games)
                })
        })
        .catch(error => next(error))
}

exports.getGameUsers = (req, res, next) => {
    const gameId = req.params.gameId;
    models.alumno.findAll({where: {gameId: gameId}})
        .then(alumnos => {
            const alumn = alumnos.map((alumno) => {
                return alumno.userId
            })
            models.user.findAll()
                .then(users => {
                    const us = users.filter((user) => {
                        return alumn.includes(user.id)
                    })
                    res.send(us)
                })
        })
        .catch(error => next(error))
}