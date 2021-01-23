const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');

exports.allowConections = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

exports.joinGame = (req, res, next) => {
    const {accessId, nickname, userId} = req.body
    models.game.findOne({where: {accessId: parseInt(accessId)}})
    .then(game => {
        if (game.locked) {
            res.send("locked")
        } else if (game.started) {
            res.send("started")
        } else {
            models.alumno.findOne({where: {username: nickname, gameId: game.id}})
                .then(alumno => {
                    if (alumno === null) {
                        const Alumno = models.alumno.build({
                            username: nickname,
                            gameId: game.id,
                            userId: userId
                        })
                        Alumno.save()
                        res.send(game)
                    } else {
                        res.send(false)
                    }
                })
                .catch(error => next(error))
        }
    })
    .catch(error => next(error))
}

exports.checkStarted = (req, res, next) => {
    const id = req.params.id;
    models.quiz.findByPk(id)
    .then(quiz => {
        if(quiz.started){
            res.send(true)
        }else{
            res.send(false)
        }
    })
    .catch(error => next(error))
}

exports.score = (req, res, next) => {
    const {score, user, gameId} = req.body
    models.alumno.findOne({where: {username: user, gameId: gameId}})
    .then(alumno => {
        let totalScore = alumno.score + score
        alumno.score = totalScore
        alumno.roundScore = score
        alumno.aciertos += 1
        alumno.save()
        res.send(alumno)
    })
    .catch(error => next(error))
}

exports.getScore = (req, res, next) => {
    const {nickname, gameId} = req.body
    models.alumno.findOne({where: {username: nickname, gameId: gameId}})
        .then(alumno => {
            let score = alumno.score
            let roundScore = alumno.roundScore
            res.send([score+"", roundScore+""])
        })
        .catch(error => next(error))
}

exports.setPosition = (req, res, next) => {
    const id = req.params.id
    const pos = req.body.pos
    models.alumno.findByPk(id)
        .then(alumno => {
            alumno.position = pos
            alumno.save({fields: ["position"]})
            res.send(true)
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
}


exports.deleteAlumno = (req, res, next) => {
    const {gameId, id} = req.params;
    models.alumno.findByPk(id, {where: {gameId: gameId}})
        .then(alumno => {
            alumno.destroy()
            models.game.findByPk(gameId, {include: models.alumno})
                .then(game => {
                    res.send(game)
                })
        })
        .catch(error => next(error))
}

exports.deleteAlumnoByName = (req, res, next) => {
    const {gameId, name} = req.params;
    models.alumno.findOne({where: {username: name, gameId: gameId}})
        .then(alumno => {
            alumno.destroy()
            models.game.findByPk(gameId, {include: models.alumno})
                .then(game => {
                    res.send(game)
                })
        })
        .catch(error => next(error))
}