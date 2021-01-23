import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {logoutUser, setUser2} from '../actions/login_action';
import kahoot from '../assets/kahoot.png'
import kahootWhite from '../assets/kahootWhite.png'


class Navbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {}
        }
        this.home = this.home.bind(this)
        this.quizzes = this.quizzes.bind(this)
        this.games = this.games.bind(this)
        this.edit = this.edit.bind(this)
        this.users = this.users.bind(this)
        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
        this.drop = this.drop.bind(this)
    }

    componentDidMount() {
        if (this.props.login.authenticated) {
            this.props.setUser2(this.props.login.user.id)
        }
        this.setState({
            user: this.props.login.user
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.user.username !== nextProps.login.user.username) {
            this.setState({
                user: nextProps.login.user
            })
        }
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

    edit(){
        this.props.history.push("/edit/"+this.props.login.user.id)
    }

    users(){
        if (window.location.pathname === "/admin/"+this.props.login.user.id+"/users") {
            window.location.reload()
        } else {
            this.props.history.push("/admin/"+this.props.login.user.id+"/users")
        }
    }

    register(){
        this.props.history.push("/register")
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
            if (path.length > 3 && (path[3] === "users" || path[2] != this.state.user.id)) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else if (button === 3) { //QUIZZES
            if (path.length > 3 && path[3] === "quizzes" && path[2] == this.state.user.id) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else if (button === 4) { //GAMES
            if (path.length > 3 && path[3] === "games" && path[2] == this.state.user.id) {
                return "navButtonClick"
            } else {
                return "navButton"
            }
        } else {
            return "navButton"
        }
    }

    drop(){
        document.getElementById("myDropdown").classList.toggle("show")
    }


    render(){
        let path = window.location.pathname
        let pathSplit = path.split("/")
        let loginOrRegister = (path === '/register' || path === '/login')
        window.onclick = (e) => {
            if (document.getElementsByClassName('dropbtn')[0] !== undefined) {
                if (!document.getElementsByClassName('dropbtn')[0].contains(e.target)) {
                    let dropdown = document.getElementById("myDropdown")
                    if (dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show')
                    }
                }
            }
        }
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
                        <div className="dropdown">
                            <button className="dropbtn" onClick={this.drop}><i className="fas fa-user-circle"/> {this.state.user.username} <i className="fas fa-caret-down"/></button>
                            <div className="dropdown-content" id="myDropdown">
                                <div className="navDrop"><button className="navButtonDrop" id="navDrop1" onClick={this.edit}><h5 style={{borderRadius: "10px 10px 0 0", margin: "0"}}><i className="fas fa-user-edit"/> Editar perfil</h5></button></div>
                                <div className="navDrop"><button className="navButtonDrop" id="navDrop2" onClick={this.props.logoutUser}><h5 style={{borderRadius: "0 0 10px 10px", margin: "0", color: "#bb0000"}}><i className="fas fa-sign-out-alt"/> Cerrar sesión</h5></button></div>
                            </div>
                        </div>
                    </nav>
                    :
                    loginOrRegister
                    ?
                    <nav style={{display: "flex", justifyContent: "center", backgroundColor: "white", borderBottom: "2px solid grey"}}>
                        <button style={{marginRight: "10px", marginLeft: "10px"}} className="navButtonPicNoLogin" onClick={this.home}><img src={kahoot}/></button>
                    </nav>
                    :
                    <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "white", borderBottom: "2px solid grey"}}>
                        <button style={{marginRight: "10px", marginLeft: "10px"}} className="navButtonPicNoLogin" onClick={this.home}><img src={kahoot}/></button>
                        <button style={{marginLeft: "auto"}} className="navButtonNoLogin" onClick={this.login}><h5 style={{marginTop: "auto", marginBottom: "auto"}}>Iniciar sesión</h5></button>
                        <button style={{marginRight: "10px", marginLeft: "10px"}} className="navButtonNoLogin" onClick={this.register}><h5 style={{marginTop: "auto", marginBottom: "auto"}}>Registrarse</h5></button>
                    </nav>
                }
            </div>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    setUser2: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    user: state.user
});

export default connect(mapStateToProps, {logoutUser, setUser2})(withRouter(Navbar));