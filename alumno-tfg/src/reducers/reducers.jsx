import {combineReducers} from 'redux';
import loginReducer from './login_reducer'
import userReducer from './user_reducer'
import quizReducer from './quiz_reducer'
import questionReducer from './question_reducer'
import gameReducer from './game_reducer'
import playReducer from './play_reducer'
import moodleReducer from './moodle_reducer'

const GlobalState = (combineReducers({
    login: loginReducer,
    user: userReducer,
    quiz: quizReducer,
    questions: questionReducer,
    game: gameReducer,
    play: playReducer,
    moodle: moodleReducer
}))

export default GlobalState;