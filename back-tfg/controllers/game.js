const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const {models} = require("../models");
const url = require('url');

exports.createGame = (req, res, next) => {
    const quizId = req.params.quizId;
    const {assignmentId, courseId, min, max} = req.body
    let accessId = 0;
    let juego = null;
    // Nos aseguramos de que el juego creado tenga un PIN de acceso
    // que no esté en uso y de que sea distinto de 0
    do {
        accessId = Math.floor(Math.random() * 1000000)
        models.game.findOne({where: {accessId: accessId}})
            .then(game => {
                juego = game
            })
    } while (accessId === 0 || juego !== null)

    models.quiz.findByPk(quizId, {include: [models.question]})
        .then(quiz => {
            let nQuestions = quiz.questions.length
            const game = models.game.build({
                quizId: quizId,
                status: 1,
                accessId: accessId,
                nQuestions: nQuestions,
                courseId: courseId,
                assignmentId: assignmentId,
                min: min,
                max: max
            })
            game.save()
                .then(game => {
                    models.game.findByPk(game.id, {include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
                        .then(game => {
                            res.send(game)
                        })
                })
                .catch(error => next(error))
        })
}


exports.getGames = (req, res, next) => {
    const userId = req.params.userId;
    models.game.findAll({include: [{model: models.quiz, as: 'quiz', where: {userId: userId}, include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
        .then(games => {
            res.send(games)
        })
        .catch(error => next(error))
}

exports.getGamesPlayed = (req, res, next) => {
    const userId = req.params.userId;
    models.game.findAll({include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
        .then(games => {
            const gamesPlayed = games.filter((game) => {
                return game.players.some((player) => player.userId === parseInt(userId))
            })
            res.send(gamesPlayed)
        })
        .catch(error => next(error))
}


exports.checkGame = (req, res, next) => {
    const accessId = req.params.accessId;
    models.game.findOne({where: {accessId: accessId}, include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
        .then(game => {
            if(game === null){
                res.send(false)
            }else{
                res.send(game)
            }
        })
        .catch(error => next(error))
}


exports.setStatus = (req, res, next) => {
    const gameId = req.params.gameId
    const status = req.body.status
    models.game.findByPk(gameId, {include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
        .then(game => {
            models.quiz.findByPk(game.quiz.id)
                .then(quiz => {
                    if (game.status === 1 && status !== 1) {
                        quiz.timesPlayed += 1
                    }
                    game.status = status
                    if (status !== 1 && game.accessId !== 0) {
                        game.accessId = 0
                    }
                    if (status === 4) {
                        game.currentQuestion += 1
                    }
                    if (status === 2) {
                        game.questionStartedAt = Date.now()
                    } else {
                        game.questionStartedAt = null
                    }
                    game.save()
                    quiz.save()
                    res.send(game)
                })
        })
        .catch(error => next(error))
}


exports.toggleLockGame = (req, res, next) => {
    const gameId = req.params.gameId
    models.game.findByPk(gameId, {include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
        .then(game => {
            let locked = game.locked
            game.locked = !locked
            game.save()
            res.send(game)
        })
        .catch(error => next(error))
}


exports.getGame = (req, res, next) => {
    const gameId = req.params.gameId;
    models.game.findByPk(gameId, {include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
        .then(game => {
            res.send(game)
        })
        .catch(error => next(error))
}

exports.deleteGame = (req, res, next) => {
    const gameId = req.params.gameId;
    models.game.findByPk(gameId)
        .then(game => {
            game.destroy()
            models.player.destroy({where: {gameId: game.id}})
            models.game.findAll({include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
                .then(games => {
                    res.send(games)
                })
        })
        .catch(error => next(error))
}

exports.getRemovedGames = (req, res, next) => {
    const userId = req.params.userId;
    models.removedGame.findAll({where: {userId: userId}})
        .then(games => {
            res.send(games)
        })
        .catch(error => next(error))
}

exports.addRemovedGames = (req, res, next) => {
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

exports.getGamePlayersUser = (req, res, next) => {
    const gameId = req.params.gameId;
    models.user.findAll({include: [{model: models.player, where: {gameId: gameId}}]})
        .then(users => {
            res.send(users)
        })
        .catch(error => console.log(error))
}

exports.checkPlaying = (req, res, next) => {
    const userId = req.params.userId;
    models.game.findOne({where: {status: {[Op.ne]: 0}}, include: [{model: models.quiz, as: 'quiz', where: {userId: userId}, include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
        .then(game => {
            if (game !== null) {
                res.send(game)
            } else {
                models.game.findOne({where: {status: {[Op.ne]: 0}}, include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user', where: {id: userId}}]}]})
                    .then(game => {
                        res.send(game)
                    })
            }
        })
        .catch(error => console.log(error))
}

exports.checkPlayingNoLogin = (req, res, next) => {
    const nickname = req.params.nickname;
    models.game.findOne({where: {status: {[Op.ne]: 0}}, include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, where: {username: nickname}, include: [{model: models.user, as: 'user'}]}]})
        .then(game => {
            res.send(game)
        })
        .catch(error => console.log(error))
}