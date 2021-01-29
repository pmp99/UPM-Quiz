import {GAME_STARTED, GET_GAMES, SET_GAME, SET_GAME_ONLY, SET_GAME_LOADING, SET_GAMES, SET_GAME_QUIZ, GET_GAMES_PLAYED, GET_GAMES_REMOVED} from '../actions/constants'

const initialState = {
    quiz: {},
    game: {},
    games: [],
    gamesPlayed: [],
    gamesRemoved: [],
    started: false,
    loading: true
}

export default function(state = initialState, action){
    switch(action.type){
        case SET_GAME:
            return {
                ...state,
                game: action.payload.game,
                quiz: action.payload.quiz,
                loading: false
            }
        case SET_GAME_ONLY:
            return {
                ...state,
                game: action.payload,
                loading: false
            }
        case SET_GAME_QUIZ:
            return {
                ...state,
                quiz: action.payload
            }
        case GET_GAMES:
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
        case GAME_STARTED:
            return {
                ...state,
                started: action.payload
            }
        case SET_GAMES:
            return {
                ...state,
                games: action.payload
            }
        case SET_GAME_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}