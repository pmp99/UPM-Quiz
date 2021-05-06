import axios from 'axios'
import {SET_GAME, SET_GAMES, GET_GAMES_PLAYED, GET_GAMES_REMOVED, GET_GAME_USERS} from './constants'
import config from '../../config/config.json'
const MOODLE_URL = config.MOODLE_URL

export const createGame = (quizId, assignmentId, courseId, min, max) => dispatch => {
    axios.post('/game/createGame/'+quizId, {assignmentId, courseId, min, max})
        .then(res => {
            dispatch({
                type: SET_GAME,
                payload: res.data
            })
        })
}

export const setGame = game => dispatch => {
    dispatch( {
        type: SET_GAME,
        payload: game
    })
}

export const getGames = userId => dispatch => {
    axios.get('/game/getGames/'+userId)
        .then(res => {
            dispatch({
                type: SET_GAMES,
                payload: res.data
            })
        })
}

export const getGamesPlayed = userId => dispatch => {
    axios.get('/game/getGamesPlayed/'+userId)
        .then(res => {
            dispatch({
                type: GET_GAMES_PLAYED,
                payload: res.data
            })
        })
}

export const getGamesRemoved = userId => dispatch => {
    axios.get('/removedGame/get/'+userId)
        .then(res => {
            dispatch({
                type: GET_GAMES_REMOVED,
                payload: res.data
            })
        })
}

export const addGamesRemoved = (userId, gameId) => dispatch => {
    axios.post('/removedGame/add/'+userId+'/'+gameId)
        .then(res => {
            dispatch({
                type: GET_GAMES_REMOVED,
                payload: res.data
            })
        })
}


export const getGame = gameId => dispatch => {
    axios.get('/game/getGame/'+gameId)
        .then(res => {
            dispatch({
                type: SET_GAME,
                payload: res.data
            })
        })
}


export const deleteGame = (gameId, history = null) => dispatch => {
    axios.delete('/game/delete/'+gameId)
        .then(res => {
            dispatch({
                type: SET_GAME,
                payload: {}
            })
            dispatch({
                type: SET_GAMES,
                payload: res.data
            })
            if (history !== null) {
                history.push('/')
            }
        })
}


export const setStatus = (gameId, status, socket, history = null) => dispatch => {
    axios.put('/game/setStatus/'+gameId, {status})
        .then(res => {
            dispatch({
                type: SET_GAME,
                payload: res.data
            })
            if (socket !== null) {
                socket.emit('refreshStatus', gameId)
            }
            if (history !== null) {
                history.push('/')
            }
        })
}


// Asigna una calificación a todos los jugadores que tengan rol alumno en la tarea asociada
export const grades = (gameId, token) => dispatch => {
    axios.get('/game/getGame/'+gameId)
        .then(async res => {
            const courses = await axios.get(MOODLE_URL + '/webservice/rest/server.php?wstoken='+token+'&wsfunction=mod_assign_get_assignments&moodlewsrestformat=json&courseids[0]='+res.data.courseId)
            const course = courses.data.courses[0]
            const assignments = course.assignments
            const assignment = assignments.find((a) => a.id === res.data.assignmentId)
            const max = assignment.grade
            const alumnos = res.data.players
            let users = await axios.get(MOODLE_URL + '/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid=' + res.data.courseId)
            users = users.data
            for (let i=0; i<alumnos.length; i++) {
                const myself = users.find((user) => user.id === alumnos[i].userId)
                if (myself.roles[0].roleid === 5) {
                    let nota = (alumnos[i].rightAnswers - res.data.min)/(res.data.max - res.data.min)
                    nota = Math.max(0, nota)
                    nota = Math.min(1, nota)
                    nota = Math.round(nota*max*10)/10
                    await axios.get(MOODLE_URL + '/webservice/rest/server.php?wstoken='+token+'&wsfunction=mod_assign_save_grade&moodlewsrestformat=json&assignmentid='+res.data.assignmentId+'&userid='+myself.id+'&grade='+nota+'&attemptnumber=-1&addattempt=0&workflowstate=aaa&applytoall=0')
                }
            }
        })
}

export const toggleLockGame = gameId => dispatch => {
    axios.put('/game/toggleLock/'+gameId)
        .then(res => {
            dispatch({
                type: SET_GAME,
                payload: res.data
            })
        })
}

export const deletePlayer = playerId => dispatch => {
    axios.delete('/player/delete/'+playerId)
        .then(res => {
            dispatch( {
                type: SET_GAME,
                payload: res.data
            })
        })
}

export const deletePlayerByName = (name, gameId) => dispatch => {
    axios.delete('/player/delete/'+name+'/game/'+gameId)
        .then(res => {
            dispatch( {
                type: SET_GAME,
                payload: res.data
            })
        })
}

export const getGamePlayersUser = gameId => dispatch => {
    axios.get('/game/getGamePlayersUser/'+gameId)
        .then(res => {
            dispatch({
                type: GET_GAME_USERS,
                payload: res.data
            })
        })
}

export const checkPlaying = (userId, nickname) => dispatch => {
    if (userId !== null) {
        axios.get('/game/checkPlaying/'+userId)
            .then(res => {
                if (res.data.id !== undefined) {
                    dispatch({
                        type: SET_GAME,
                        payload: res.data
                    })
                }
            })
    } else {
        axios.get('/game/checkPlayingNoLogin/'+nickname)
            .then(res => {
                if (res.data.id !== undefined) {
                    dispatch({
                        type: SET_GAME,
                        payload: res.data
                    })
                }
            })
    }
}