const Sequelize = require("sequelize");
const {models} = require("../models");
const url = require('url');
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const globby = require("globby")


exports.createQuestion = (req, res, next) => {
    const quizId = req.params.quizId
    const {question, answer0, answer1, answer2, answer3, correct, time} = req.body;
    const pregunta = models.question.build({
        question: question,
        answer0: answer0,
        answer1: answer1,
        answer2: answer2,
        answer3: answer3,
        correctAnswer: JSON.stringify(correct),
        time: time,
        image: "",
        quizId: quizId,
    })
    pregunta.save({fields: ["question", "answer0", "answer1", "answer2", "answer3", "correctAnswer", "time", "image", "quizId"]})
    .then(pregunta => {
        models.quiz.findByPk(pregunta.quizId, {include: [models.question]})
            .then(quiz => {
                res.send({quiz: quiz, questionId: pregunta.id})
            })
    })
}

exports.editQuestion = (req, res, next) => {
    const id = req.params.questionId;
    const {question, answer0, answer1, answer2, answer3, correct, time, keepImage} = req.body;
    models.question.findByPk(id)
        .then(pregunta => {
            pregunta.question = question
            pregunta.answer0 = answer0
            pregunta.answer1 = answer1
            pregunta.answer2 = answer2
            pregunta.answer3 = answer3
            pregunta.correctAnswer = JSON.stringify(correct)
            pregunta.time = time
            if (!keepImage) {
                pregunta.image = ""
            }
            pregunta.save({fields: ["question", "answer0", "answer1", "answer2", "answer3", "correctAnswer", "time", "image"]})
                .then(pregunta => {
                    models.quiz.findByPk(pregunta.quizId, {include: [models.question]})
                        .then(quiz => {
                            res.send(quiz)
                        })
                })
        })
}

exports.editImageQuestion = async (req, res, next) => {
    const questionId = req.params.questionId
    const file = req.file
    if (file.detectedFileExtension !== '.jpg' && file.detectedFileExtension !== '.png' && file.detectedFileExtension !== '.svg') {
        return res.send('Imagen no soportada. Utilice jpg, png o svg')
    }
    const files = await globby('./public/questionImages/question' + questionId + '*')
    files.map((file) => {
        fs.unlinkSync(file)
    })
    const fileName = 'question' + questionId + file.detectedFileExtension
    await pipeline(file.stream, fs.createWriteStream(`${__dirname}/../public/questionImages/${fileName}`))
    models.question.findByPk(questionId)
        .then(question => {
            question.image = '/questionImages/question' + question.id + file.detectedFileExtension
            question.save({fields: ["image"]})
                .then((question) => {
                    models.quiz.findByPk(question.quizId, {include: [models.question]})
                        .then(quiz => {
                            res.send(quiz)
                        })
                })
        })
}

exports.deleteQuestion = async (req, res, next) => {
    const questionId = req.params.questionId
    const files = await globby('./public/questionImages/question' + questionId + '*')
    files.map((file) => {
        fs.unlinkSync(file)
    })
    models.question.findByPk(questionId)
    .then(question => {
        const quizId = question.quizId
        question.destroy()
        models.quiz.findByPk(quizId, {include: models.question})
        .then(quiz => {
            res.send(quiz)
        })
    })
    .catch(error => next(error))
}

exports.getQuestion = (req, res, next) => {
    const questionId = req.params.questionId
    models.question.findByPk(questionId)
    .then(question => {
        res.send(question)
    })
    .catch(error => next(error))
}
