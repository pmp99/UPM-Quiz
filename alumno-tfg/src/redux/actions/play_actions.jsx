import axios from 'axios'
import {CHECK_GAME_TRUE, CHECK_GAME_FALSE, JOIN_GAME, PLAY_ERROR, SET_GAME, SET_PLAYER} from './constants'

export const checkGame = (accessId, token) => dispatch => {
    if (parseInt(accessId) === 0) {
        dispatch({
            type: CHECK_GAME_FALSE,
            payload: "El ID introducido no es válido"
        })
    } else {
        axios.get('/game/check/'+accessId)
            .then(async res => {
                if(!res.data){
                    dispatch({
                        type: CHECK_GAME_FALSE,
                        payload: "El ID introducido no está disponible"
                    })
                }else{
                    const assignment = res.data.assignmentId
                    if (assignment !== null) {
                        if (token === null) {
                            dispatch({
                                type: CHECK_GAME_FALSE,
                                payload: "No estás matriculado en el curso"
                            })
                        } else {
                            let users = await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid=' + res.data.courseId)
                            if (Array.isArray(users.data)) {
                                dispatch({
                                    type: CHECK_GAME_TRUE,
                                    payload: res.data.id
                                })
                            } else {
                                dispatch({
                                    type: CHECK_GAME_FALSE,
                                    payload: "No estás matriculado en el curso"
                                })
                            }
                        }
                    } else {
                        dispatch({
                            type: CHECK_GAME_TRUE,
                            payload: res.data.id
                        })
                    }
                }
            })
    }
}



export const joinGame = (request, socket) => dispatch => {
    const accessId = request.accessId;
    const nickname = request.nickname;
    const userId = request.userId;
    if (nickname === "") {
        dispatch({
            type: CHECK_GAME_FALSE,
            payload: "Introduzca un nombre"
        })
        return
    }
    axios.post('/player/join', {accessId, nickname, userId})
    .then(res => {
        if (res.data !== false) {
            if (res.data === "locked") {
                dispatch({
                    type: CHECK_GAME_FALSE,
                    payload: "El juego al que intentas acceder está bloqueado"
                })
            } else if (res.data === "started") {
                dispatch({
                    type: CHECK_GAME_FALSE,
                    payload: "El juego al que intentas acceder ya ha comenzado"
                })
            } else {
                dispatch({
                    type: JOIN_GAME,
                    payload: {nickname, accessId}
                })
                dispatch({
                    type: SET_GAME,
                    payload: res.data
                })
                socket.emit('joinGame', res.data.id)
            }
        } else {
            dispatch({
                type: CHECK_GAME_FALSE,
                payload: "El nickname ya está cogido"
            })
        }
    })
}


export const getPlayer = (nickname, gameId) => dispatch => {
    axios.get('/player/getPlayer/'+gameId+'/'+nickname)
        .then(res => {
            dispatch({
                type: SET_PLAYER,
                payload: res.data
            })
        })
}

export const setPositions = gameId => dispatch => {
    axios.get('/game/getGame/'+gameId)
        .then(res => {
            let alumnos = res.data.players
            alumnos.sort((a, b) => {return b.score-a.score})
            alumnos.map((alumno, index) => {
                let pos = index + 1
                axios.put('/player/setPosition/'+alumno.id, {pos})
                    .then(res => {
                        if (res.data) {
                            console.log("Posición guardada")
                        }
                    })
            })
        })
}

export const resetSubmitAnswer = gameId => dispatch => {
    axios.put('/player/resetSubmitAnswer', {gameId})
        .then(res => {
            dispatch({
                type: SET_GAME,
                payload: res.data
            })
        })
}

export const resetPlayError = () => dispatch => {
    dispatch({
        type: PLAY_ERROR,
        payload: ""
    })
}
