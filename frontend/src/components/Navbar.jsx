import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {logoutUser, loginUser, resetLoginError} from '../redux/actions/login_action';
import logo from '../assets/Logo.png'
import logoWhite from '../assets/LogoWhite.png'
import DialogLogin from "./DialogLogin";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";


class Navbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            loginDialogOpen: false,
            email: "",
            password: ""
        }
        this.home = this.home.bind(this)
        this.quizzes = this.quizzes.bind(this)
        this.games = this.games.bind(this)
        this.users = this.users.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.drop = this.drop.bind(this)
        this.handleCloseLoginDialog = this.handleCloseLoginDialog.bind(this)
        this.handleChangeLogin = this.handleChangeLogin.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }

    home(){
        this.props.history.push('/')
    }

    quizzes(){
        this.props.history.push("/user/"+this.props.login.user.id+"/quizzes")
    }

    games(){
        this.props.history.push("/user/"+this.props.login.user.id+"/games")
    }

    users(){
        this.props.history.push("/user/"+this.props.login.user.id+"/users")
    }

    login(){
        this.setState({
            loginDialogOpen: true
        })
    }

    logout(){
        document.getElementById("myDropdown").classList.remove("show")
        this.props.logoutUser()
    }

    handleCloseLoginDialog(value){
        if (value) {
            this.setState({
                loginDialogOpen: false
            }, () => {
                const user = {
                    email: this.state.email,
                    password: this.state.password
                };
                this.props.loginUser(user)
            })
        } else {
            this.setState({
                loginDialogOpen: false
            })
        }
    }

    handleChangeLogin(value, type){
        let state = this.state
        state[type] = value
        this.setState(state)
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetLoginError()
    }

    styles(path, button){
        if (button === 1) { //HOME
            if (path.length === 3 && path[1] === "user") {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else if (button === 2) { //USERS
            if (path.length > 3 && (path[3] === "users" || parseInt(path[2]) !== this.props.login.user.id)) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else if (button === 3) { //QUIZZES
            if (path.length > 3 && path[3] === "quizzes" && parseInt(path[2]) === this.props.login.user.id) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else if (button === 4) { //GAMES
            if (path.length > 3 && path[3] === "games" && parseInt(path[2]) === this.props.login.user.id) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else {
            return "navButton"
        }
    }

    drop(){
        if (!document.getElementById("myDropdown").classList.contains('show')) {
            document.getElementById("myDropdown").classList.add("show")
        }
    }


    render(){
        let path = window.location.pathname
        let pathSplit = path.split("/")
        if (this.props.login.authenticated) {
            window.onmousemove = (e) => {
                if (document.getElementsByClassName('dropbtn')[0] !== undefined || document.getElementsByClassName('dropdown-content')[0] !== undefined) {
                    if (!document.getElementsByClassName('dropbtn')[0].contains(e.target) && !document.getElementsByClassName('dropdown-content')[0].contains(e.target)) {
                        let dropdown = document.getElementById("myDropdown")
                        if (dropdown.classList.contains('show')) {
                            dropdown.classList.remove('show')
                        }
                    }
                }
            }
            return(
                <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "#1867b7", borderBottom: "1px solid midnightblue", position: "sticky", top: "0", zIndex: "10"}}>
                    <button style={{marginRight: "10px"}} className="navButtonPic" onClick={this.home}><img src={logoWhite} alt="Logo"/></button>
                    <button style={{marginRight: "10px"}} className={this.styles(pathSplit, 1)} onClick={this.home}><h4 style={{marginTop: "auto", marginBottom: "auto"}}><i className="fas fa-home"/> Inicio</h4></button>
                    {this.props.login.user.isAdmin ?
                        <button className={this.styles(pathSplit, 2)} onClick={this.users}><h4 style={{marginTop: "auto", marginBottom: "auto"}}><i className="fas fa-users"/> Usuarios</h4></button> : null}
                    <button style={{marginRight: "10px", marginLeft: "10px"}} className={this.styles(pathSplit, 3)} onClick={this.quizzes}><h4 style={{marginTop: "auto", marginBottom: "auto"}}><i className="fas fa-list-ul"/> Quizzes</h4></button>
                    <button style={{marginRight: "auto", marginLeft: "10px"}} className={this.styles(pathSplit, 4)} onClick={this.games}><h4 style={{marginTop: "auto", marginBottom: "auto"}}><i className="fas fa-chart-bar"/> Juegos</h4></button>
                    <div className="dropdown">
                        <button className="dropbtn" onMouseEnter={this.drop}><div style={{display: "flex", justifyContent: "center", alignItems: "center"}}><i className="fas fa-user-circle"/> &nbsp; {this.props.login.user.name} &nbsp; <i className="fas fa-caret-down"/></div></button>
                        <div className="dropdown-content" id="myDropdown">
                            <div className="navDrop"><button className="navButtonDrop" id="navDrop1" onClick={this.logout}><h5 id="navDrop1Text"><i className="fas fa-sign-out-alt"/> Cerrar sesión</h5></button></div>
                        </div>
                    </div>
                </nav>
            )
        } else {
            return(
                <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "white", borderBottom: "2px solid grey", position: "sticky", top: "0", zIndex: "10"}}>
                    <button style={{marginRight: "10px"}} className="navButtonPicNoLogin" onClick={this.home}><img src={logo} alt="Logo"/></button>
                    <button style={{marginRight: "10px", marginLeft: "auto"}} className="navButtonNoLogin" onClick={this.login}><h5 style={{marginTop: "auto", marginBottom: "auto"}}>Iniciar sesión</h5></button>
                    <DialogLogin open={this.state.loginDialogOpen}
                                 email={this.state.email}
                                 password={this.state.password}
                                 handleClose={this.handleCloseLoginDialog}
                                 handleChange={this.handleChangeLogin}
                    />
                    <Snackbar open={this.props.login.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                        <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                            {this.props.login.error}
                        </MuiAlert>
                    </Snackbar>
                </nav>
            )
        }
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    loginUser: PropTypes.func.isRequired,
    resetLoginError: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    user: state.user
});

export default connect(mapStateToProps, {logoutUser, loginUser, resetLoginError})(withRouter(Navbar));