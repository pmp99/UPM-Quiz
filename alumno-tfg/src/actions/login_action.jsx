import axios from 'axios';
import {SET_USER, LOGIN_ERROR} from './constants'

//Action que se ejecuta al hacer login
export const loginUser = (user, history) => dispatch => {
    let username = user.username;
    let password = user.password;

    axios.post('/login', {username, password})
    .then(res => {
        if (!res.data) {
            dispatch({
                type: LOGIN_ERROR,
                payload: "El nombre de usuario o la contraseña es incorrecto"
            })
        } else {
            const session = {
                user: {
                    username: res.data.username,
                    isAdmin: res.data.isAdmin,
                    id: res.data.id
                }
            }
            localStorage.setItem("session", JSON.stringify(session))
            dispatch(setUser(session.user));
            history.push('/')
        }
    })
}

export const setUser = user => {
    if(user.username === undefined){
        return {
            type: SET_USER,
            payload: {}
        }
    } else {
        return {
            type: SET_USER,
            payload: user
        }
    }
}

export const setUser2 = id => dispatch => {
    axios.get('/'+id+'/user')
        .then(res => {
            dispatch(setUser(res.data));
        })
}

export const logoutUser = () => dispatch => {
    localStorage.removeItem('session');
    dispatch(setUser({}));
}