import axios from 'axios'
import {
    SET_GAME,
    SET_GAME_ONLY,
    GET_GAMES,
    SET_GAMES,
    SET_GAME_LOADING,
    SET_GAME_QUIZ,
    GET_GAMES_PLAYED,
    GET_GAMES_REMOVED,
    GET_GAME_USERS
} from './constants'
import {setQuestion} from './question_actions'

export const createGame = (quizId, userId, props, assignmentId, courseId, min, max) => dispatch => {
    axios.post('/user/'+userId+'/newGame/'+quizId, {assignmentId, courseId, min, max})
        .then(res => {
            const game = res.data
            dispatch(setGame(game, props.quiz.quiz))
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
                    dispatch(setGame(res.data, res1.data))
                    props.history.push('/')
                })
        })
}


// Asigna una calificación a todos los jugadores que tengan rol alumno en la tarea asociada
export const grades = (gameId, token) => dispatch => {
    axios.get('/game/'+gameId+'/view')
        .then(async res => {
            const courses = await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken='+token+'&wsfunction=mod_assign_get_assignments&moodlewsrestformat=json&courseids[0]='+res.data.courseId)
            const course = courses.data.courses[0]
            const assignments = course.assignments
            const assignment = assignments.find((a) => a.id === res.data.assignmentId)
            const max = assignment.grade
            const alumnos = res.data.alumnos
            let users = await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid=' + res.data.courseId)
            users = users.data
            for (let i=0; i<alumnos.length; i++) {
                const myself = users.find((user) => user.id === alumnos[i].userId)
                if (myself.roles[0].roleid === 5) {
                    let nota = (alumnos[i].aciertos - res.data.min)/(res.data.max - res.data.min)
                    nota = Math.max(0, nota)
                    nota = Math.min(1, nota)
                    nota = Math.round(nota*max*10)/10
                    await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken='+token+'&wsfunction=mod_assign_save_grade&moodlewsrestformat=json&assignmentid='+res.data.assignmentId+'&userid='+myself.id+'&grade='+nota+'&attemptnumber=-1&addattempt=0&workflowstate=aaa&applytoall=0')
                }
            }
        })
}

export const toggleLockGame = gameId => dispatch => {
    axios.put('/game/'+gameId+'/toggleLock')
        .then(res => {
            dispatch({
                type: SET_GAME_ONLY,
                payload: res.data
            })
        })
}

export const deleteAlumno = (id, gameId) => dispatch => {
    axios.delete('/game/'+gameId+'/delete/alumno/'+id)
        .then(res => {
            dispatch( {
                type: SET_GAME_ONLY,
                payload: res.data
            })
        })
}

export const deleteAlumnoByName = (name, gameId) => dispatch => {
    axios.delete('/game/'+gameId+'/delete/alumnoName/'+name)
        .then(res => {
            dispatch( {
                type: SET_GAME_ONLY,
                payload: res.data
            })
        })
}

export const getGameUsers = (gameId) => dispatch => {
    axios.get('/game/'+gameId+'/getGameUsers')
        .then(res => {
            dispatch({
                type: GET_GAME_USERS,
                payload: res.data
            })
        })
}