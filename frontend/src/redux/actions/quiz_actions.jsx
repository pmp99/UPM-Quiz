import axios from 'axios'
import {SET_QUIZ, SET_QUIZZES, GET_QUIZZES_REMOVED, QUIZ_ERROR} from './constants'

export const createQuiz = (quizName, ownerId, props) => dispatch => {
    axios.post('/quiz/createQuiz/'+ownerId, {quizName})
    .then(res => {
        const quiz = res.data
        dispatch(setQuiz(quiz))
        props.history.push('/user/'+props.login.user.id+'/quizzes/'+quiz.id)
    })
}

export const editQuiz = (quizId, name) => dispatch => {
    axios.put('/quiz/editQuiz/'+quizId, {name})
        .then(res => {
            const userId = res.data.user.id
            dispatch(getQuizzes(userId))
        })
}

export const setQuiz = quiz => dispatch => {
    dispatch( {
        type: SET_QUIZ,
        payload: quiz
    })
}

export const getQuizzes = userId => dispatch => {
    axios.get('/quiz/getQuizzes/'+userId)
    .then(res => {
        dispatch({
            type: SET_QUIZZES,
            payload: res.data
        })
    })
}

export const getQuiz = id => dispatch => {
    axios.get('/quiz/getQuiz/'+id)
    .then(res => {
        dispatch(setQuiz(res.data))
    })
}

export const deleteQuiz = quizId => dispatch => {
    axios.delete('/quiz/delete/'+quizId)
    .then(res => {
        dispatch({
            type: SET_QUIZZES,
            payload: res.data
        })
    })
}

export const getQuizzesRemoved = id => dispatch => {
    axios.get('/removedQuiz/get/'+id)
        .then(res => {
            dispatch({
                type: GET_QUIZZES_REMOVED,
                payload: res.data
            })
        })
}

export const addQuizzesRemoved = (userId, quizId) => dispatch => {
    axios.post('/removedQuiz/add/'+userId+'/'+quizId)
        .then(res => {
            dispatch({
                type: GET_QUIZZES_REMOVED,
                payload: res.data
            })
        })
}

export const setQuizError = error => dispatch => {
    dispatch({
        type: QUIZ_ERROR,
        payload: error
    })
}

export const resetQuizError = () => dispatch => {
    dispatch(setQuizError(""))
}