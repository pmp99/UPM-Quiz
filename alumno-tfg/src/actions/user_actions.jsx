import axios from 'axios';
import {GET_USERS, GET_USER, REGISTER_ERROR, REGISTER_SUCCESS} from './constants';

export const newUser = (user, history) => dispatch => {
    const username = user.username;
    const password = user.password;
    const email = user.email;
    axios.post('/register', {username, password, email})
    .then(res => {
        if(res.data === true){
            const user = {
                username: username,
                password: password
            };
            dispatch({
                type: REGISTER_SUCCESS,
                payload: "Cuenta creada con éxito"
            })
            history.push('/login')
        } else{
            dispatch({
                type: REGISTER_ERROR,
                payload: res.data
            })
        }
    })
}

export const getUsers = () => dispatch => {
    axios.get('/admin/index')
    .then(res => {
        dispatch({
            type: GET_USERS,
            payload: res.data
        })
    })
}

export const deleteUser = (id, history) => dispatch => {
    axios.delete('/admin/delete/'+id)
    .then(res => {
        console.log("Deleted")
        dispatch(getUsers())
    })
}

export const getUser = id => dispatch => {
    axios.get('/edit/'+id)
    .then(res => {
        dispatch({
            type: GET_USER,
            payload: res.data
        })
    })
}

export const editUser = (user, id) => dispatch => {
    const username = user.username;
    const email = user.email;
    axios.put('/edit/'+id, {username,email})
    .then(res => {
        console.log("Edited")
        dispatch(getUser(id));
    })
}
