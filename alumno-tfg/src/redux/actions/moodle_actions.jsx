import axios from 'axios';
import {GET_COURSES, GET_MOODLE_USERS, GET_ASSIGNMENTS} from './constants';

// Obtiene los cursos en los que el usuario tiene el rol de profesor (rol 3)
export const getCourses = (userId, token) => async dispatch => {
    let courses = await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_users_courses&moodlewsrestformat=json&userid=' + userId)
    courses = courses.data
    let myCourses = []
    for (let i=0; i<courses.length; i++) {
        let users = await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid=' + courses[i].id)
        users = users.data
        const user = users.filter((user) => {
            return user.id === userId
        })
        const myself = user[0]
        if (myself.roles[0].roleid === 3) {
            myCourses.push(courses[i])
        }
    }
    dispatch({
        type: GET_COURSES,
        payload: myCourses
    })
}

// Obtiene los usuarios matriculados en un curso
export const getMoodleUsers = (courseId, token) => async dispatch => {
    let users = await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken=' + token + '&wsfunction=core_enrol_get_enrolled_users&moodlewsrestformat=json&courseid=' + courseId)
    users = users.data
    dispatch({
        type: GET_MOODLE_USERS,
        payload: users
    })
}

// Obtiene las tareas de un curso en las que se puede asignar una calificación numérica
export const getAssignments = (courseId, token) => async dispatch => {
    let assignments = await axios.get('http://localhost/moodle/webservice/rest/server.php?wstoken='+token+'&wsfunction=mod_assign_get_assignments&moodlewsrestformat=json&courseids[0]='+courseId)
    assignments = assignments.data.courses[0].assignments
    assignments = assignments.filter((assignment) => {
        return assignment.grade > 0
    })
    dispatch({
        type: GET_ASSIGNMENTS,
        payload: assignments
    })
}
