import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {loginUser, resetLoginError} from '../actions/login_action';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Navbar from "./Navbar";

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: ""
        }
        this.login = this.login.bind(this);
        this.closeAlert = this.closeAlert.bind(this)
    }

    login(e){
        e.preventDefault()
        const user = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(user, this.props.history)
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetLoginError()
    }

    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Navbar/>
                <h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Iniciar sesión</h1>
                <div style={{marginBottom: "auto"}}>
                    <form onSubmit={this.login} id="inputForm">
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Correo electrónico</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({email: e.target.value})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({password: e.target.value})} required/>
                        </div>
                        {this.state.email === "" || this.state.password === "" ?
                            <input type="submit" value="Iniciar sesión" id="loginButtonDisabled"/> :
                            <input type="submit" value="Iniciar sesión" id="loginButton"/>}
                    </form>
                </div>
                <Snackbar open={this.props.login.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                    <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                        {this.props.login.error}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
}


Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    reserLoginError: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    user: state.user
});

export default connect(mapStateToProps, {loginUser, resetLoginError})(withRouter(Login));