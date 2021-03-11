import { Provider } from 'react-redux';
import history from '../history';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {setUser} from '../actions/login_action';

import store from './Store';
import React from 'react';
import Main from './Main';
import Login from './Login';
import AdminView from '../components/Administrador/AdminView';
import UserView from '../components/User/UserView';
import ViewUsers from './Administrador/ViewUsers';
import CreateQuiz from './User/CreateQuiz';
import EditQuiz from './User/EditQuiz';
import ViewQuizzes from './User/ViewQuizzes';
import AddQuestions from './User/AddQuestions';
import ViewQuiz from './User/ViewQuiz';
import EditQuestion from './User/EditQuestion';
import PlayQuiz from './User/PlayQuiz';
import Game from './User/Game';
import Results from './User/Results';
import ViewGames from './User/ViewGames';
import ViewGame from './User/ViewGame';
import Play from './Play';
import PIN from "./PIN";
import RutaAdminOrMyself from "./comun/RutaAdminOrMyself";
import RutaMyself from "./comun/RutaMyself";


if(localStorage.session){
    let session = JSON.parse(localStorage.session);
    store.dispatch(setUser(session.user))
}


export default class App extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Provider store={store}>
                <Router history={history}>
                    <Route exact path="/" component={Main}/>
                    <Switch>
                        <Route exact path="/game" component={PIN}/>
                        <Route exact path="/game/:gameQuizID" component={Play}/>
                        <RutaMyself exact path="/admin/:userID" component={AdminView}/>
                        <RutaMyself exact path="/user/:userID" component={UserView}/>
                        <Route exact path="/login" component={Login}/>
                        <RutaMyself exact path="/admin/:userID/users" component={ViewUsers}/>
                        <RutaAdminOrMyself exact path="/user/:userID/games" component={ViewGames}/>
                        <RutaMyself exact path="/admin/:userID/games" component={ViewGames}/>
                        <RutaAdminOrMyself exact path="/user/:userID/games/:gameQuizID" component={ViewGame}/>
                        <RutaAdminOrMyself exact path="/admin/:userID/games/:gameQuizID" component={ViewGame}/>
                        <RutaAdminOrMyself exact path="/user/:userID/newQuiz" component={CreateQuiz}/>
                        <RutaAdminOrMyself exact path="/user/:userID/quizzes" component={ViewQuizzes}/>
                        <RutaMyself exact path="/admin/:userID/quizzes" component={ViewQuizzes}/>
                        <RutaAdminOrMyself exact path="/user/:userID/quizzes/:quizID" component={ViewQuiz}/>
                        <RutaAdminOrMyself exact path="/user/:userID/quizzes/:quizID/edit" component={EditQuiz}/>
                        <RutaAdminOrMyself exact path="/user/:userID/quizzes/:quizID/add" component={AddQuestions}/>
                        <RutaAdminOrMyself exact path="/user/:userID/quizzes/:quizID/edit/:questionID" component={EditQuestion}/>
                        <RutaMyself exact path="/user/:userID/quizzes/:quizID/play" component={PlayQuiz}/>
                        <RutaMyself exact path="/user/:userID/quizzes/:quizID/playing" component={Game}/>
                        <RutaMyself exact path="/user/:userID/quizzes/:quizID/results" component={Results}/>
                        <Redirect to="/"/>
                    </Switch>
                </Router>
            </Provider>
        );
    }
}