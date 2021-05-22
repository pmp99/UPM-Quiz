import {SET_GAME, SET_GAMES, GET_GAMES_PLAYED, GET_GAMES_REMOVED, GET_GAME_USERS} from '../actions/constants'

const initialState = {
    game: {},
    games: [],
    gamesPlayed: [],
    gamesRemoved: [],
    playersUser: []
}

function gameReducer(state = initialState, action){
    switch(action.type){
        case SET_GAME:
            return {
                ...state,
                game: action.payload
            }
        case SET_GAMES:
            return {
                ...state,
                games: action.payload
            }
        case GET_GAMES_PLAYED:
            return {
                ...state,
                gamesPlayed: action.payload
            }
        case GET_GAMES_REMOVED:
            return {
                ...state,
                gamesRemoved: action.payload
            }
        case GET_GAME_USERS:
            return {
                ...state,
                playersUser: action.payload
            }
        default:
            return state;
    }
}

export default gameReducer;