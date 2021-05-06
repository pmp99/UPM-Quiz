const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');

exports.getQuizzes = (req, res, next) => {
    const userId = req.params.userId;
    models.quiz.findAll({where: {userId}, include: [{model: models.question}, {model: models.user, as: 'user'}]})
        .then(quizzes => {
            res.send(quizzes)
        })
}

exports.createQuiz = (req, res, next) => {
    const userId = req.params.userId;
    const quizName = req.body.quizName;
    const quiz = models.quiz.build({
        name: quizName,
        userId: userId
    })
    quiz.save()
    .then(quiz => {
        models.quiz.findByPk(quiz.id, {include: [{model: models.question}, {model: models.user, as: 'user'}]})
            .then(quiz => res.send(quiz))
    })
    .catch(error => next(error))
}

exports.editQuiz = (req, res, next) => {
    const userId = req.params.userId;
    const name = req.body.name;
    models.quiz.findByPk(userId, {include: [{model: models.question}, {model: models.user, as: 'user'}]})
        .then(quiz => {
            quiz.name = name
            quiz.save({fields: ['name']})
                .then(quiz => {
                    models.quiz.findByPk(quiz.id, {include: [{model: models.question}, {model: models.user, as: 'user'}]})
                        .then(quiz => res.send(quiz))
                })
        })
        .catch(error => next(error))
}

exports.deleteQuiz = (req, res, next) => {
    const quizId = req.params.quizId;
    models.quiz.findByPk(quizId)
    .then(quiz => {
        quiz.destroy()
        models.question.destroy({where: {quizId: quiz.id}})
        models.game.destroy({where: {quizId: quiz.id}})
        models.quiz.findAll({include: [{model: models.question}, {model: models.user, as: 'user'}]})
        .then(quizzes => {
            res.send(quizzes)
        })
    })
    .catch(error => next(error))
}

exports.getQuiz = (req, res, next) => {
    const quizId = req.params.quizId;
    models.quiz.findByPk(quizId, {include: [{model: models.question}, {model: models.user, as: 'user'}]})
    .then(quiz => {
        res.send(quiz)
    })
    .catch(error => next(error))
}

exports.getRemovedQuizzes = (req, res, next) => {
    const userId = req.params.userId;
    models.removedQuiz.findAll({where: {userId: userId}})
        .then(quizzes => {
            res.send(quizzes)
        })
        .catch(error => next(error))
}

exports.addRemovedQuizzes = (req, res, next) => {
    const userId = req.params.userId;
    const quizId = req.params.quizId;
    const quiz = models.removedQuiz.build({
        userId: userId,
        quizId: quizId
    })
    quiz.save()
        .then(() => {
            models.removedQuiz.findAll({where: {userId: userId}})
                .then(quizzes => {
                    res.send(quizzes)
                })
        })
        .catch(error => next(error))
}