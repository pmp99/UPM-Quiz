import axios from 'axios'
import {
    BACKGROUND_COLOR,
    CHECK_GAME_FALSE,
    CHECK_GAME_TRUE,
    JOIN_GAME,
    PLAY_ERROR,
    SET_GAME,
    SET_NICKNAME,
    SET_PLAYER
} from './constants'
import config from '../../config/config.json'

const MOODLE_URL = config.MOODLE_URL

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
                            let users = await axios.get(MOODLE_URL + '/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid=' + res.data.courseId)
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
    if (nickname.toLowerCase() === "undefined") {
        dispatch({
            type: CHECK_GAME_FALSE,
            payload: "Nombre no válido"
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
                payload: "El nombre ya está cogido"
            })
        }
    })
}

export const setNickname = nickname => dispatch => {
        dispatch({
            type: SET_NICKNAME,
            payload: nickname
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

export const changeBackgroundColor = t => dispatch => {
    const r = Math.round(Math.sin(2*Math.PI*t)*127 + 128)
    const g = Math.round(Math.sin(2*Math.PI*t + 2*Math.PI/3)*127 + 128)
    const b = Math.round(Math.sin(2*Math.PI*t + 4*Math.PI/3)*127 + 128)
    const rgbToHex = (rgb) => {
        return rgb.toString(16).length < 2 ? '0' + rgb.toString(16) : rgb.toString(16)
    }
    const color = rgbToHex(r) + rgbToHex(g) + rgbToHex(b)
    dispatch({
        type: BACKGROUND_COLOR,
        payload: {color: color, time: t}
    })
}
