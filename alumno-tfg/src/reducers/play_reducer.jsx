import {CHECK_GAME_TRUE, CHECK_GAME_FALSE, GAME_STARTED, JOIN_GAME, SCORE} from '../actions/constants'

const initialState = {
    user: "",
    error: "",
    accessId: 0,
    checked: false,
    started: false,
    score: 0,
    roundScore: 0
}

export default function(state = initialState, action){
    switch(action.type){
        case CHECK_GAME_TRUE:
            return {
                ...state,
                checked: true,
                error: ""
            }
        case CHECK_GAME_FALSE:
            return {
                ...state,
                error: action.payload,
                checked: false
            }
        case GAME_STARTED:
            return {
                ...state,
                started: true
            }
        case JOIN_GAME:
            return {
                ...state,
                user: action.payload.nickname,
                accessId: action.payload.accessId
            }
        case SCORE:
            return {
                ...state,
                score: action.payload[0],
                roundScore: action.payload[1]
            }
        default:
            return state
    }
}