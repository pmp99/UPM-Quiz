import axios from 'axios'
import {
    SET_GAME,
    SET_GAME_ONLY,
    GET_GAMES,
    SET_GAMES,
    SET_GAME_LOADING,
    SET_GAME_QUIZ,
    GET_GAMES_PLAYED,
    GET_GAMES_REMOVED
} from './constants'
import {setQuestion} from './question_actions'

export const createGame = (quizId, userId, props) => dispatch => {
    axios.post('/user/'+userId+'/newGame/'+quizId)
        .then(res => {
            const game = res.data
            dispatch(setGame(game, props.quiz.quiz))
            console.log("Game created")
            props.history.push('/user/'+props.login.user.id+'/quizzes/'+quizId+'/play')
        })
}

export const setGame = (game, quiz) => dispatch => {
    dispatch( {
        type: SET_GAME,
        payload: {game, quiz}
    })
}

export const getGames = id => dispatch => {
    axios.get('/view/games/'+id)
        .then(res => {
            dispatch({
                type: GET_GAMES,
                payload: res.data
            })
        })
}

export const getGamesFromUser = id => dispatch => {
    axios.get('/view/gamesFromUser/'+id)
        .then(res => {
            dispatch({
                type: GET_GAMES,
                payload: res.data
            })
        })
}

export const getGamesPlayed = id => dispatch => {
    axios.get('/view/gamesPlayed/'+id)
        .then(res => {
            dispatch({
                type: GET_GAMES_PLAYED,
                payload: res.data
            })
        })
}

export const getGamesRemoved = id => dispatch => {
    axios.get('/gamesRemoved/'+id)
        .then(res => {
            dispatch({
                type: GET_GAMES_REMOVED,
                payload: res.data
            })
        })
}

export const addGamesRemoved = (userId, gameId) => dispatch => {
    axios.post('/gamesRemoved/add/'+userId+'/'+gameId)
        .then(res => {
            dispatch({
                type: GET_GAMES_REMOVED,
                payload: res.data
            })
        })
}

export const getQuizFromGame = id => dispatch => {
    axios.get('/view/quizFromGame/'+id)
        .then(res => {
            dispatch({
                type: SET_GAME_QUIZ,
                payload: res.data
            })
        })
}


export const getGame = (gameId, quizId) => dispatch => {
    axios.get('/quiz/'+quizId+'/view')
        .then(res1 => {
            axios.get('/game/'+gameId+'/view')
                .then(res => {
                    dispatch(setGame(res.data, res1.data))
                    dispatch(setQuestion(res1.data.pregunta))
                })
        })
}


export const deleteGame = id => dispatch => {
    axios.delete('/game/'+id+'/delete')
        .then(res => {
            console.log("Deleted")
            dispatch({
                type: SET_GAMES,
                payload: res.data
            })
        })
}

export const setGameLoading = () => dispatch => {
    dispatch({
        type: SET_GAME_LOADING,
        payload: true
    })
}

export const startGame = id => dispatch => {
    axios.put('/game/start/'+id)
        .then(res => {
            console.log("Game started")
        })
}

export const endGame = (gameId, quizId, props) => dispatch => {
    axios.get('/quiz/'+quizId+'/view')
        .then(res1 => {
            axios.put('/game/end/'+gameId)
                .then(res => {
                    console.log("Game ended")
                    dispatch(setGame(res.data, res1.data))
                    props.history.push('/')
                })
        })
}

export const toggleLockGame = gameId => dispatch => {
    axios.put('/game/'+gameId+'/toggleLock')
        .then(res => {
            res.data.locked ? console.log("Game locked") : console.log("Game unlocked")
            dispatch({
                type: SET_GAME_ONLY,
                payload: res.data
            })
        })
}

export const deleteAlumno = (id, gameId) => dispatch => {
    axios.delete('/game/'+gameId+'/delete/alumno/'+id)
        .then(res => {
            console.log("Deleted")
            dispatch( {
                type: SET_GAME_ONLY,
                payload: res.data
            })
        })
}

export const deleteAlumnoByName = (name, gameId) => dispatch => {
    axios.delete('/game/'+gameId+'/delete/alumnoName/'+name)
        .then(res => {
            console.log("Deleted")
            dispatch( {
                type: SET_GAME_ONLY,
                payload: res.data
            })
        })
}