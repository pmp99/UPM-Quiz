const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');

exports.allowConections = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

exports.index = (req, res, next) => {
    const id = req.params.id;
    models.user.findByPk(id)
    .then(user => {
        const userId = user.id;
        models.quiz.findAll({where: {userId}, include: [models.pregunta]})
        .then(quizzes => {
            res.send(quizzes)
        })
    })
    .catch(error => next(error))
}

exports.createQuiz = (req, res, next) => {
    const {quizName, ownerId} = req.body;
    
    const quiz = models.quiz.build({
        name: quizName,
        userId: ownerId
    })

    quiz.save()
    .then(quiz => {
        res.send(quiz)
    })
    .catch(error => next(error))
}

exports.editQuiz = (req, res, next) => {
    const id = req.params.id;
    const name = req.body.name;
    models.quiz.findByPk(id)
        .then(quiz => {
            quiz.name = name
            quiz.save({fields: ['name']})
                .then(quiz => {
                    res.send(quiz)
                })
        })
        .catch(error => next(error))
}

exports.deleteQuiz = (req, res, next) => {
    const quizId = req.params.id;
    models.quiz.findByPk(quizId)
    .then(quiz => {
        quiz.destroy()
        models.pregunta.destroy({where: {quizId: quiz.id}})
        models.game.destroy({where: {quizId: quiz.id}})
        models.quiz.findAll()
        .then(quizzes => {
            res.send(quizzes)
        })
    })
    .catch(error => next(error))
}

exports.viewQuiz = (req, res, next) => {
    const quizId = req.params.id;
    models.quiz.findByPk(quizId, {include: [models.pregunta]})
    .then(quiz => {
        res.send(quiz)
    })
    .catch(error => next(error))
}

exports.viewGames = (req, res, next) => {
    const quizId = req.params.id;
    models.game.findAll({where: {quizId: quizId}})
    .then(games => {
        res.send(games)
    })
}