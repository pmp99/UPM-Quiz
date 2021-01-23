import {GET_USERS, GET_USER, SET_USERS, REGISTER_ERROR, REGISTER_SUCCESS} from '../actions/constants';

const initialState = {
    user: {},
    users: [],
    deleted: false,
    error: "",
    success: ""
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_USERS:
            return {
                ...state,
                users: action.payload
            }
        case GET_USER:
            return {
                ...state,
                user: action.payload
            }
        case SET_USERS:
            return {
                ...state,
                users: action.payload
            }
        case REGISTER_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                success: action.payload
            }
        default:
            return state;
    }
}