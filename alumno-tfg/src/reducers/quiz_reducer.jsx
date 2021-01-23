import {SET_QUIZ, GET_QUIZZES, SET_QUIZZES} from '../actions/constants';

const initialState = {
    quiz: {},
    quizzes: []
}

export default function(state = initialState, action){
    switch(action.type){
        case SET_QUIZ:
            return {
                ...state,
                quiz: action.payload
            }
        case GET_QUIZZES:
            return {
                ...state,
                quizzes: action.payload
            }
        case SET_QUIZZES:
            return {
                ...state,
                quizzes: action.payload
            }
        default:
            return state;
    }
}