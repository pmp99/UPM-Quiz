const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');


exports.allowConections = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

exports.newQuestion = (req, res, next) => {
    const {id} = req.params;
    const {question, answer0, answer1, answer2, answer3, correct, time, image} = req.body;
    const imgStr = ""+image+""
    const preg = models.pregunta.build({
        question: question,
        answer0: answer0,
        answer1: answer1,
        answer2: answer2,
        answer3: answer3,
        correctAnswer: correct,
        time: time,
        quizId: id,
        image: imgStr
    })
    preg.save({fields: ["question", "answer0", "answer1", "answer2", "answer3", "correctAnswer", "time","image", "quizId"]})
    .then(pregunta => {
        models.quiz.findByPk(id)
        .then(quiz => {
            res.send(true)
        })
    })
}

exports.deleteQuestion = (req, res, next) => {
    const {quizId, id} = req.params;
    models.pregunta.findByPk(id, {where: {quizId: quizId}})
    .then(pregunta => {
        pregunta.destroy() 
        models.quiz.findByPk(quizId, {include: models.pregunta})
        .then(quiz => {
            res.send(quiz)
        })
    })
    .catch(error => next(error))
}

exports.editQuestion = (req, res, next) => {
    const id = req.params.id;
    const {question, answer0, answer1, answer2, answer3, correct, time, image} = req.body;
    const imgStr = ""+image+""
    models.pregunta.findByPk(id)
    .then(pregunta => {
        pregunta.question = question
        pregunta.answer0 = answer0
        pregunta.answer1 = answer1
        pregunta.answer2 = answer2
        pregunta.answer3 = answer3
        pregunta.correctAnswer = correct
        pregunta.time = time
        pregunta.image = imgStr
        pregunta.save({fields: ["question", "answer0", "answer1", "answer2", "answer3", "correctAnswer", "time", "image"]})
        .then(pregunta => {
            res.send(pregunta)
        })
    })
    .catch(error => next(error))
}

exports.getQuestion = (req, res, next) => {
    const {quizId, questionId} = req.params
    models.pregunta.findOne({where: {id: questionId, quizId: quizId}})
    .then(pregunta => {
        res.send(pregunta)
    })
    .catch(error => next(error))
}

exports.endQuestion = (req, res, next) => {
    const {quizId, questionId} = req.body
    models.pregunta.findOne({where: {id: questionId, quizId: quizId}})
    .then(pregunta => {
        pregunta.finished = true
        pregunta.save()
        res.send(true)
    })
    .catch(error => next(error))
}

exports.getAnswer = (req, res, next) => {
    const {id, quizId} = req.params;
    models.pregunta.findAll({where: {quizId: quizId, id: id}})
    .then(pregunta => {
        res.send(pregunta)
    })
}
