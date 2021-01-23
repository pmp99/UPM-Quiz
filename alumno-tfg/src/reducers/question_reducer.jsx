import {SET_QUESTION, SET_QUESTIONS} from '../actions/constants'

const initialState = {
    pregunta: {},
    preguntas: []
}

export default function(state = initialState, action){
    switch(action.type){
        case SET_QUESTIONS:
            return {
                ...state,
                preguntas: action.payload
            }
        case SET_QUESTION:
            return {
                ...state,
                pregunta: action.payload
            }
        default:
            return state
    }
}