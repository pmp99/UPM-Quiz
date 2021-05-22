import {GET_COURSES, GET_MOODLE_USERS, GET_ASSIGNMENTS} from '../actions/constants';

const initialState = {
    courses: [],
    users: [],
    assignments: []
}

function moodleReducer(state = initialState, action){
    switch(action.type){
        case GET_COURSES:
            return {
                ...state,
                courses: action.payload
            }
        case GET_MOODLE_USERS:
            return {
                ...state,
                users: action.payload
            }
        case GET_ASSIGNMENTS:
            return {
                ...state,
                assignments: action.payload
            }
        default:
            return state;
    }
}

export default moodleReducer;