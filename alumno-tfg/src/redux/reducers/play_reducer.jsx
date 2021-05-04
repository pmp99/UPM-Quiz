import {CHECK_GAME_TRUE, CHECK_GAME_FALSE, JOIN_GAME, PLAY_ERROR, SET_PLAYER, SET_NICKNAME} from '../actions/constants'

const initialState = {
    user: "",
    error: "",
    accessId: 0,
    checked: "",
    player: {}
}

export default function(state = initialState, action){
    switch(action.type){
        case CHECK_GAME_TRUE:
            return {
                ...state,
                checked: action.payload,
                error: ""
            }
        case CHECK_GAME_FALSE:
            return {
                ...state,
                error: action.payload,
                checked: ""
            }
        case JOIN_GAME:
            return {
                ...state,
                user: action.payload.nickname,
                accessId: action.payload.accessId
            }
        case SET_PLAYER:
            return {
                ...state,
                player: action.payload,
            }
        case SET_NICKNAME:
            return {
                ...state,
                user: action.payload,
            }
        case PLAY_ERROR:
            return {
                ...state,
                error: ""
            }
        default:
            return state
    }
}