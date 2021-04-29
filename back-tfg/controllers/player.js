const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');


exports.joinGame = (req, res, next) => {
    const {accessId, nickname, userId} = req.body
    models.game.findOne({where: {accessId: parseInt(accessId)}})
    .then(game => {
        if (game.locked) {
            res.send("locked")
        } else if (game.status !== 1) {
            res.send("started")
        } else {
            models.player.findOne({where: {username: nickname, gameId: game.id}})
                .then(player => {
                    if (player === null) {
                        const Player = models.player.build({
                            username: nickname,
                            gameId: game.id,
                            userId: userId
                        })
                        Player.save()
                        models.game.findByPk(game.id, {include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
                            .then(game => {
                                res.send(game)
                            })
                    } else {
                        res.send(false)
                    }
                })
                .catch(error => next(error))
        }
    })
    .catch(error => next(error))
}

exports.setScore = (req, res, next) => {
    const {score, answer, user, gameId} = req.body
    models.player.findOne({where: {username: user, gameId: gameId}})
    .then(player => {
        let totalScore = player.score + score
        player.score = totalScore
        player.roundScore = score
        player.answerSubmitted = answer
        if (score > 0) {
            player.rightAnswers += 1
        }
        player.save()
        res.send(player)
    })
    .catch(error => next(error))
}

exports.resetSubmitAnswer = (req, res, next) => {
    const gameId = req.body.gameId
    models.player.update({answerSubmitted: null}, {where: {gameId: gameId}})
        .then(() => {
            models.game.findByPk(gameId, {include: [{model: models.quiz, as: 'quiz', include: [{model: models.user, as: 'user'}, {model: models.question}]}, {model: models.player, include: [{model: models.user, as: 'user'}]}]})
                .then(game => {
                    res.send(game)
                })
        })
        .catch(error => next(error))
}

exports.setPosition = (req, res, next) => {
    const playerId = req.params.playerId
    const pos = req.body.pos
    models.player.findByPk(playerId)
        .then(player => {
            player.position = pos
            player.save({fields: ["position"]})
            res.send(true)
        })
        .catch(error => next(error))
}

exports.getPlayer = (req, res, next) => {
    const nickname = req.params.nickname
    const gameId = req.params.gameId
    models.player.findOne({where: {username: nickname, gameId: gameId}})
        .then(player => {
            res.send(player)
        })
        .catch(error => next(error))
}


exports.deletePlayer = (req, res, next) => {
    const playerId = req.params.playerId;
    models.player.findByPk(playerId)
        .then(player => {
            const gameId = player.gameId
            player.destroy()
            models.game.findByPk(gameId, {include: models.player})
                .then(game => {
                    res.send(game)
                })
        })
        .catch(error => next(error))
}

exports.deletePlayerByName = (req, res, next) => {
    const {gameId, name} = req.params;
    models.player.findOne({where: {username: name, gameId: gameId}})
        .then(player => {
            player.destroy()
            models.game.findByPk(gameId, {include: models.player})
                .then(game => {
                    res.send(game)
                })
        })
        .catch(error => next(error))
}