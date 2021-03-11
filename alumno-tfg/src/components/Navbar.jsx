import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/login_action';
import kahoot from '../assets/kahoot.png'
import kahootWhite from '../assets/kahootWhite.png'


class Navbar extends Component {
    constructor(props){
        super(props);
        this.home = this.home.bind(this)
        this.quizzes = this.quizzes.bind(this)
        this.games = this.games.bind(this)
        this.users = this.users.bind(this)
        this.login = this.login.bind(this)
    }

    home(){
        if (this.props.login.authenticated) {
            if (this.props.login.user.isAdmin) {
                if (window.location.pathname === "/admin/"+this.props.login.user.id) {
                    window.location.reload()
                } else {
                    this.props.history.push("/admin/"+this.props.login.user.id)
                }
            } else {
                if (window.location.pathname === "/user/"+this.props.login.user.id) {
                    window.location.reload()
                } else {
                    this.props.history.push("/user/"+this.props.login.user.id)
                }
            }
        } else {
            if (window.location.pathname === '/') {
                window.location.reload()
            } else {
                this.props.history.push('/')
            }
        }
    }

    quizzes(){
        if (this.props.login.user.isAdmin) {
            if (window.location.pathname === "/admin/"+this.props.login.user.id+"/quizzes") {
                window.location.reload()
            } else {
                this.props.history.push("/admin/"+this.props.login.user.id+"/quizzes")
            }
        } else {
            if (window.location.pathname === "/user/"+this.props.login.user.id+"/quizzes") {
                window.location.reload()
            } else {
                this.props.history.push("/user/"+this.props.login.user.id+"/quizzes")
            }
        }
    }

    games(){
        if (this.props.login.user.isAdmin) {
            if (window.location.pathname === "/admin/"+this.props.login.user.id+"/games") {
                window.location.reload()
            } else {
                this.props.history.push("/admin/"+this.props.login.user.id+"/games")
            }
        } else {
            if (window.location.pathname === "/user/"+this.props.login.user.id+"/games") {
                window.location.reload()
            } else {
                this.props.history.push("/user/"+this.props.login.user.id+"/games")
            }
        }
    }

    users(){
        if (window.location.pathname === "/admin/"+this.props.login.user.id+"/users") {
            window.location.reload()
        } else {
            this.props.history.push("/admin/"+this.props.login.user.id+"/users")
        }
    }

    login(){
        this.props.history.push("/login")
    }

    styles(path, button){
        if (button === 1) { //HOME
            if (path.length === 3 && (path[1] === "user" || path[1] === "admin")) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else if (button === 2) { //USERS
            if (path.length > 3 && (path[3] === "users" || path[2] != this.props.login.user.id)) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else if (button === 3) { //QUIZZES
            if (path.length > 3 && path[3] === "quizzes" && path[2] == this.props.login.user.id) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else if (button === 4) { //GAMES
            if (path.length > 3 && path[3] === "games" && path[2] == this.props.login.user.id) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else {
            return "navButton"
        }
    }


    render(){
        let path = window.location.pathname
        let pathSplit = path.split("/")
        let login = path === '/login'
        return(
            <div>
                {
                    this.props.login.authenticated
                    ?
                    <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "#46178f"}}>
                        <button style={{marginRight: "10px", marginLeft: "10px"}} className="navButtonPic" onClick={this.home}><img src={kahootWhite}/></button>
                        <button style={{marginRight: "10px"}} className={this.styles(pathSplit, 1)} onClick={this.home}><h4 style={{marginTop: "auto", marginBottom: "auto"}}><i className="fas fa-home"/> Home</h4></button>
                        {this.props.login.user.isAdmin ?
                            <button className={this.styles(pathSplit, 2)} onClick={this.users}><h4 style={{marginTop: "auto", marginBottom: "auto"}}><i className="fas fa-users"/> Usuarios</h4></button> : null}
                        <button style={{marginRight: "10px", marginLeft: "10px"}} className={this.styles(pathSplit, 3)} onClick={this.quizzes}><h4 style={{marginTop: "auto", marginBottom: "auto"}}><i className="fas fa-list-ul"/> Kahoots</h4></button>
                        <button style={{marginRight: "auto", marginLeft: "10px"}} className={this.styles(pathSplit, 4)} onClick={this.games}><h4 style={{marginTop: "auto", marginBottom: "auto"}}><i className="fas fa-chart-bar"/> Reports</h4></button>
                        <button id="logout" onClick={this.props.logoutUser}><h5 id="logoutIcon"><i className="fas fa-sign-out-alt"/></h5></button>
                        <h2 id="name">{this.props.login.user.name} <i className="fas fa-user-circle"/></h2>
                    </nav>
                    :
                    login
                    ?
                    <nav style={{display: "flex", justifyContent: "center", backgroundColor: "white", borderBottom: "2px solid grey"}}>
                        <button style={{marginRight: "10px", marginLeft: "10px"}} className="navButtonPicNoLogin" onClick={this.home}><img src={kahoot}/></button>
                    </nav>
                    :
                    <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "white", borderBottom: "2px solid grey"}}>
                        <button style={{marginRight: "10px", marginLeft: "10px"}} className="navButtonPicNoLogin" onClick={this.home}><img src={kahoot}/></button>
                        <button style={{marginRight: "10px", marginLeft: "auto"}} className="navButtonNoLogin" onClick={this.login}><h5 style={{marginTop: "auto", marginBottom: "auto"}}>Iniciar sesión</h5></button>
                    </nav>
                }
            </div>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    user: state.user
});

export default connect(mapStateToProps, {logoutUser})(withRouter(Navbar));