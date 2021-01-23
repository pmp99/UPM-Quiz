import axios from 'axios'
import {SET_QUIZ, GET_QUIZZES, SET_QUIZZES} from './constants'
import {setQuestion} from './question_actions'

export const createQuiz = (quizName, ownerId, props) => dispatch => {
    axios.post('/user/newQuiz', {quizName, ownerId})
    .then(res => {
        const quiz = res.data
        dispatch(setQuiz(quiz))
        props.history.push('/user/'+props.login.user.id+'/quizzes/'+quiz.id)
        console.log("Quiz created")
    })
}

export const editQuiz = (id, name, props) => dispatch => {
    axios.put('/edit/quiz/'+id, {name})
        .then(res => {
            console.log("Quiz Edited")
            props.history.push('/user/'+props.login.user.id+'/quizzes')
        })
}

export const setQuiz = quiz => dispatch => {
    dispatch( {
        type: SET_QUIZ,
        payload: quiz
    })
}

export const getQuizzes = id => dispatch => {
    axios.get('/view/quizzes/'+id)
    .then(res => {
        dispatch({
            type: GET_QUIZZES,
            payload: res.data
        })
    })
}

export const getQuiz = id => dispatch => {
    axios.get('/quiz/'+id+'/view')
    .then(res => {
        dispatch(setQuiz(res.data))
        dispatch(setQuestion(res.data.pregunta))
    })
}

export const deleteQuiz = id => dispatch => {
    axios.delete('/quiz/'+id+'/delete')
    .then(res => {
        console.log("Deleted")
        dispatch({
            type: SET_QUIZZES,
            payload: res.data
        })
    })
}