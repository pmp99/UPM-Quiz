import {createBrowserHistory} from 'history';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import {setUser, logoutUser} from '../redux/actions/login_action';

import React from 'react';
import IdleTimer from "../helpers/IdleTimer";
import Main from './Main';
import UserView from './UserView';
import ViewUsers from './Administrador/ViewUsers';
import ViewQuizzes from './User/ViewQuizzes';
import ViewQuiz from './User/ViewQuiz';
import PlayQuiz from './User/PlayQuiz';
import Game from './User/Game';
import Results from './User/Results';
import ViewGames from './User/ViewGames';
import ViewGame from './User/ViewGame';
import Play from './Play';
import PIN from "./PIN";
import RutaAdminOrMyself from "./comun/RutaAdminOrMyself";
import RutaMyself from "./comun/RutaMyself";
import RutaAdmin from "./comun/RutaAdmin";

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
                    timeout: 900, //expire after 900 seconds (15 minutes)
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
                    timeout: 900, //expire after 900 seconds (15 minutes)
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
                    <RutaMyself exact path="/user/:userID" component={UserView}/>
                    <RutaAdmin exact path="/user/:userID/users" component={ViewUsers}/>
                    <RutaAdminOrMyself exact path="/user/:userID/quizzes" component={ViewQuizzes}/>
                    <RutaAdminOrMyself exact path="/user/:userID/quizzes/:quizID" component={ViewQuiz}/>
                    <RutaAdminOrMyself exact path="/user/:userID/games" component={ViewGames}/>
                    <RutaAdminOrMyself exact path="/user/:userID/games/:gameID" component={ViewGame}/>
                    <RutaMyself exact path="/user/:userID/quizzes/:quizID/play" component={PlayQuiz}/>
                    <RutaMyself exact path="/user/:userID/quizzes/:quizID/playing" component={Game}/>
                    <RutaMyself exact path="/user/:userID/quizzes/:quizID/results" component={Results}/>
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