import axios from 'axios'
import {SET_QUIZ, QUIZ_ERROR} from './constants'

export const newQuestion = (quizId, pregunta, changeImage) => dispatch => {
    const question = pregunta.question;
    const answer0 = pregunta.answer0;
    const answer1 = pregunta.answer1;
    const answer2 = pregunta.answer2;
    const answer3 = answer2 === "" ? "" : pregunta.answer3;
    let correct = pregunta.correct;
    if (answer2 === "" && correct.includes(2)) {
        correct.splice(correct.indexOf(2), 1)
    }
    if (answer3 === "" && correct.includes(3)) {
        correct.splice(correct.indexOf(3), 1)
    }
    const time = pregunta.time;
    axios.post('/question/createQuestion/'+quizId,{question, answer0, answer1, answer2, answer3, correct, time})
    .then(res => {
        if (changeImage) {
            const questionId = res.data.questionId
            const data = new FormData()
            data.append("file", pregunta.file)
            axios.put('/question/editQuestionImage/'+questionId, data, { headers: { 'Content-Type': 'multipart/form-data' }})
                .then(res => {
                    if (res.data.id !== undefined) {
                        dispatch({
                            type: SET_QUIZ,
                            payload: res.data
                        })
                    } else {
                        dispatch({
                            type: QUIZ_ERROR,
                            payload: res.data
                        })
                    }
                })
        } else {
            dispatch({
                type: SET_QUIZ,
                payload: res.data.quiz
            })
        }
    })
}

export const editQuestion = (id, pregunta, changeImage, keepImage) => dispatch => {
    const question = pregunta.question;
    const answer0 = pregunta.answer0;
    const answer1 = pregunta.answer1;
    const answer2 = pregunta.answer2;
    const answer3 = answer2 === "" ? "" : pregunta.answer3;
    let correct = pregunta.correct;
    if (answer2 === "" && correct.includes(2)) {
        correct.splice(correct.indexOf(2), 1)
    }
    if (answer3 === "" && correct.includes(3)) {
        correct.splice(correct.indexOf(3), 1)
    }
    const time = pregunta.time;
    axios.put('/question/editQuestion/'+id, {question, answer0, answer1, answer2, answer3, correct, time, keepImage})
        .then(res => {
            if (changeImage) {
                const data = new FormData()
                data.append("file", pregunta.file)
                axios.put('/question/editQuestionImage/'+id, data, { headers: { 'Content-Type': 'multipart/form-data' }})
                    .then(res => {
                        if (res.data.id !== undefined) {
                            dispatch({
                                type: SET_QUIZ,
                                payload: res.data
                            })
                        } else {
                            dispatch({
                                type: QUIZ_ERROR,
                                payload: res.data
                            })
                        }
                    })
            } else {
                dispatch({
                    type: SET_QUIZ,
                    payload: res.data
                })
            }
        })
        .catch(error => console.log(error))
}

export const deleteQuestion = (id) => dispatch => {
    axios.delete('/question/delete/'+id)
    .then(res => {
        console.log("Deleted")
        dispatch({
            type: SET_QUIZ,
            payload: res.data
        })
    })
}


export const submitAnswer = (data, pregunta, gameId, socket) => dispatch => {
    const user = data.user
    const answer = data.answer
    axios.get('/question/getQuestion/'+pregunta.id)
    .then(res => {
        let score = 0
        if (JSON.parse(res.data.correctAnswer).includes(answer)){
            score = Math.round(500 + 500*(pregunta.remainingTime/pregunta.totalTime))
        }
        axios.put('/player/setScore', {score, answer, user, gameId})
            .then(() => {
                socket.emit('refreshStatus', gameId)
            })
    })
}
