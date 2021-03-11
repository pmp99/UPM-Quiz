import axios from 'axios'
import {CHECK_GAME_TRUE, CHECK_GAME_FALSE, GAME_STARTED, JOIN_GAME, SCORE, OK, PLAY_ERROR} from './constants'

export const checkGame = (accessId, token, userId) => dispatch => {
    if (parseInt(accessId) === 0) {
        dispatch(PIN0())
    } else {
        axios.get('/game/check/'+accessId)
            .then(async res => {
                if(!res.data){
                    dispatch(noGame())
                }else{
                    const assignment = res.data.assignmentId
                    if (assignment !== null) {
                        if (token === null) {
                            dispatch(notAllowed())
                        } else {
                            let users = await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid=' + res.data.courseId)
                            if (Array.isArray(users.data)) {
                                dispatch(game())
                            } else {
                                dispatch(notAllowed())
                            }
                        }
                    } else {
                        dispatch(game())
                    }
                }
            })
    }
}

const noGame = () => {
    return {
        type: CHECK_GAME_FALSE,
        payload: "El ID introducido no está disponible"
    }
}

const notAllowed = () => {
    return {
        type: CHECK_GAME_FALSE,
        payload: "No estás matriculado en el curso"
    }
}

const game = () => {
    return {
        type: CHECK_GAME_TRUE,
        payload: true
    }
}

const PIN0 = () => {
    return {
        type: CHECK_GAME_FALSE,
        payload: "El ID introducido no es válido"
    }
}

const userChosen = () => {
    return {
        type: CHECK_GAME_FALSE,
        payload: "El nickname ya está cogido"
    }
}

const userEmpty = () => {
    return {
        type: CHECK_GAME_FALSE,
        payload: "Introduzca un nombre"
    }
}

const gameLocked = () => {
    return {
        type: CHECK_GAME_FALSE,
        payload: "El juego al que intentas acceder está bloqueado"
    }
}

const gameStarted = () => {
    return {
        type: CHECK_GAME_FALSE,
        payload: "El juego al que intentas acceder ya ha comenzado"
    }
}

export const joinGame = (request, history) => dispatch => {
    const accessId = request.accessId;
    const nickname = request.nickname;
    const userId = request.userId;
    if (nickname === "") {
        dispatch(userEmpty())
        return
    }
    axios.post('/alumno/join', {accessId, nickname, userId})
    .then(res => {
        if (res.data !== false) {
            if (res.data === "locked") {
                dispatch(gameLocked())
            } else if (res.data === "started") {
                dispatch(gameStarted())
            } else {
                const game = res.data
                //Cantor pairing function
                const w = game.id+game.quizId
                const gameQuizId = game.quizId + (w*(w+1))/2
                dispatch(join(nickname, accessId))
                history.push('/game/'+gameQuizId)
            }
        } else {
            dispatch(userChosen())
        }
    })
}

const join = (nickname, accessId) => {
    return{
        type: JOIN_GAME,
        payload: {nickname, accessId}
    }
}

export const checkStarted = id => dispatch => {
    axios.get('/alumno/check/'+id)
    .then(res => {
        if(res.data){
            dispatch(started())
        }
    })
}

const started = () => {
    return {
        type: GAME_STARTED,
        payload: true
    }
}

export const getScore = (nickname, gameId) => dispatch => {
    axios.put('/alumno/score', {nickname, gameId})
        .then(res => {
            dispatch({
                type: SCORE,
                payload: res.data
            })
        })
}

export const setPositions = gameId => dispatch => {
    axios.get('/game/'+gameId+'/view')
        .then(res => {
            let alumnos = res.data.alumnos
            alumnos.sort((a, b) => {return b.score-a.score})
            alumnos.map((alumno, index) => {
                let pos = index + 1
                axios.put('/alumno/'+alumno.id+'/position', {pos})
                    .then(res => {
                        if (res.data) {
                            console.log("Posición guardada")
                        }
                    })
            })
            dispatch({
                type: OK,
                payload: null
            })
        })
}

export const resetPlayError = () => dispatch => {
    dispatch({
        type: PLAY_ERROR,
        payload: ""
    })
}
