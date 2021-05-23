import {createBrowserHistory} from 'history';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import {setUser, logoutUser} from '../redux/actions/login_action';

import React from 'react';
import IdleTimer from "../helpers/IdleTimer";
import Main from './Main';
import UserView from './User/UserView';
import ViewUsers from './User/ViewUsers';
import ViewQuizzes from './User/ViewQuizzes';
import ViewQuiz from './User/ViewQuiz';
import GameLoading from './User/GameLoading';
import Game from './User/Game';
import GameResults from './User/GameResults';
import ViewGames from './User/ViewGames';
import ViewGame from './User/ViewGame';
import Play from './Play';
import PIN from "./PIN";
import RouteAdminOrMyself from "./Routes/RouteAdminOrMyself";
import RouteMyself from "./Routes/RouteMyself";
import RouteAdmin from "./Routes/RouteAdmin";
import config from '../config/config.json'

const AUTO_LOGOUT_TIME = config.AUTO_LOGOUT_TIME

const history = createBrowserHistory();

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            timer: null
        }
    }

    componentDidMount() {
        if (localStorage.session) {
            let session = JSON.parse(localStorage.session)
            this.props.setUser(session.user)
            this.setState({
                timer: new IdleTimer({
                    timeout: AUTO_LOGOUT_TIME, //expire after AUTO_LOGOUT_TIME seconds
                    onTimeout: () => {
                        this.props.logoutUser()
                    },
                    onExpired: () => {
                        //do something if expired on load
                        this.props.logoutUser()
                    }
                })
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.login.authenticated && this.props.login.authenticated) {
            this.setState({
                timer: new IdleTimer({
                    timeout: AUTO_LOGOUT_TIME, //expire after AUTO_LOGOUT_TIME seconds
                    onTimeout: () => {
                        this.props.logoutUser()
                    },
                    onExpired: () => {
                        //do something if expired on load
                        this.props.logoutUser()
                    }
                })
            })
        } else if (prevProps.login.authenticated && !this.props.login.authenticated) {
            this.state.timer.cleanUp()
            this.setState({timer: null})
        }
    }

    componentWillUnmount() {
        if (this.state.timer !== null) {
            this.state.timer.cleanUp()
        }
    }

    render() {
        return(
            <Router history={history}>
                <Route exact path="/" component={Main}/>
                <Switch>
                    <Route exact path="/game" component={PIN}/>
                    <Route exact path="/game/:gameID" component={Play}/>
                    <RouteMyself exact path="/user/:userID" component={UserView}/>
                    <RouteAdmin exact path="/user/:userID/users" component={ViewUsers}/>
                    <RouteAdminOrMyself exact path="/user/:userID/quizzes" component={ViewQuizzes}/>
                    <RouteAdminOrMyself exact path="/user/:userID/quizzes/:quizID" component={ViewQuiz}/>
                    <RouteAdminOrMyself exact path="/user/:userID/games" component={ViewGames}/>
                    <RouteAdminOrMyself exact path="/user/:userID/games/:gameID" component={ViewGame}/>
                    <RouteMyself exact path="/user/:userID/quizzes/:quizID/play" component={GameLoading}/>
                    <RouteMyself exact path="/user/:userID/quizzes/:quizID/playing" component={Game}/>
                    <RouteMyself exact path="/user/:userID/quizzes/:quizID/results" component={GameResults}/>
                    <Redirect to="/"/>
                </Switch>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return { ...state };
}

export default connect(mapStateToProps, {setUser, logoutUser})(App);