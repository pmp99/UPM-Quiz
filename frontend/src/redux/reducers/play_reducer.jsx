import {CHECK_GAME_TRUE, CHECK_GAME_FALSE, JOIN_GAME, PLAY_ERROR, SET_PLAYER, SET_NICKNAME, BACKGROUND_COLOR} from '../actions/constants'

const initialState = {
    user: "",
    error: "",
    accessId: 0,
    checked: null,
    player: {},
    backgroundColor: {color: "80ee12", time: 0}
}

function playReducer(state = initialState, action){
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
                checked: null
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
        case BACKGROUND_COLOR:
            return {
                ...state,
                backgroundColor: action.payload
            }
        default:
            return state
    }
}

export default playReducer;