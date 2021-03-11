import axios from 'axios';
import {GET_USERS} from './constants';

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
    .then(() => {
        console.log("Deleted")
        dispatch(getUsers())
    })
}
