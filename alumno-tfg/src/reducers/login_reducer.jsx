import {SET_USER, LOGIN_ERROR} from '../actions/constants';
import isEmpty from '../validation/isEmpty';

const initialState = {
    authenticated: false,
    user: {},
    error: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case SET_USER:
            return {
                ...state,
                authenticated: !isEmpty(action.payload),
                user: action.payload
            }
        case LOGIN_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}