import {axios} from 'axios';

export const userServices = {
    login
}

function login(username, password) {
    axios.post('http://localhost:5000/login', {username : username, password: password})
    .then(res => {
        console.log("data", res.data);
        return res.data;
    })
}   