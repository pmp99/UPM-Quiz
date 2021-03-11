import axios from 'axios'
import {SET_QUESTION, SET_QUESTIONS, SET_QUIZ, SET_GAME} from './constants'

export const newQuestion = (quizId, pregunta, props) => dispatch => {
    const question = pregunta.question;
    const answer0 = pregunta.answer0;
    const answer1 = pregunta.answer1;
    const answer2 = pregunta.answer2;
    const answer3 = pregunta.answer3;
    const correct = pregunta.correct;
    const time = pregunta.time;
    const image = pregunta.imageSrc;
    axios.post('/new/question/'+quizId, {question, answer0, answer1, answer2, answer3, correct, time, image})
    .then(res => {
        console.log("Added")
        props.history.push('/user/'+props.login.user.id+'/quizzes/'+quizId)
    })
}

export const setQuestion = preguntas => disptach => {
        disptach({
            type: SET_QUESTIONS,
            payload: preguntas
        })
}

export const getQuestion = (questionId, quizId) => dispatch => {
    axios.get('/get/quiz/'+quizId+'/question/'+questionId)
    .then(res => {
        dispatch({
            type: SET_QUESTION,
            payload: res.data
        })
    })
}

export const deleteQuestion = (id, quizId) => dispatch => {
    axios.delete('/quiz/'+quizId+'/delete/question/'+id)
    .then(res => {
        console.log("Deleted")
        dispatch({
            type: SET_QUIZ,
            payload: res.data
        })
    })
}

export const editQuestion = (id, pregunta, props) => dispatch => {
    const question = pregunta.question;
    const answer0 = pregunta.answer0;
    const answer1 = pregunta.answer1;
    const answer2 = pregunta.answer2;
    const answer3 = pregunta.answer3;
    const correct = pregunta.correct;
    const time = pregunta.time;
    const image = pregunta.imageSrc;
    axios.put('/edit/question/'+id, {question, answer0, answer1, answer2, answer3, correct, time, image})
    .then(res => {
        console.log("Question Edited")
        props.history.push('/user/'+props.login.user.id+'/quizzes/'+res.data.quizId)
    })
}

export const endQuestion = (quizId, questionId) => dispatch => {
    axios.put('/question/end', {quizId, questionId})
        .then(() => {
            console.log("Question ended")
        })
}

export const submitAnswer = (data, pregunta, gameId) => dispatch => {
    const user = data.user
    const answer = data.answer
    const quizId = pregunta.quizId
    axios.get('/question/'+pregunta.id+'/answer/'+quizId)
    .then(res => {
        if (answer === res.data[0].correctAnswer){
            const score = Math.round(500 + 500*(pregunta.remainingTime/pregunta.totalTime))
            axios.put('/alumno/answer', {score, user, gameId})
                .then(() => {
                    console.log("Answer submitted")
                })
        }
    })
}
