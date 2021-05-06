import axios from 'axios';
import {SET_USER, LOGIN_ERROR} from './constants'
import config from '../../config/config.json'
const MOODLE_URL = config.MOODLE_URL

export const loginUser = user => dispatch => {
    const email = user.email;
    const password = user.password;

    axios.get(MOODLE_URL + '/login/token.php?username='+email+'&password='+password+'&service=moodle_mobile_app')
        .then(res => {
            if (res.data.token === undefined) {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: "El correo electrónico o la contraseña es incorrecto"
                })
            } else {
                const token = res.data.token
                axios.get(MOODLE_URL + '/webservice/rest/server.php?wstoken='+token+'&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json')
                    .then(res => {
                        const name = res.data.fullname
                        const id = res.data.userid
                        axios.post('/user/login', {id, name, email})
                            .then(res => {
                                let user = res.data
                                user.token = token
                                localStorage.setItem("session", JSON.stringify({user: user}))
                                dispatch(setUser(user));
                            })
                    })
            }
        })
}

export const setUser = user => {
    return {
        type: SET_USER,
        payload: user
    }
}

export const resetLoginError = () => dispatch => {
    dispatch({
        type: LOGIN_ERROR,
        payload: ""
    })
}

export const logoutUser = () => dispatch => {
    localStorage.removeItem('session');
    dispatch(setUser({}));
}