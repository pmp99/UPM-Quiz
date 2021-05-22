import {SET_QUIZ, SET_QUIZZES, GET_QUIZZES_REMOVED, QUIZ_ERROR} from '../actions/constants';

const initialState = {
    quiz: {},
    quizzes: [],
    quizzesRemoved: [],
    error: ""
}

function quizReducer(state = initialState, action){
    switch(action.type){
        case SET_QUIZ:
            return {
                ...state,
                quiz: action.payload
            }
        case SET_QUIZZES:
            return {
                ...state,
                quizzes: action.payload
            }
        case GET_QUIZZES_REMOVED:
            return {
                ...state,
                quizzesRemoved: action.payload
            }
        case QUIZ_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}

export default quizReducer;