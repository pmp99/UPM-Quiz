import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {loginUser} from '../actions/login_action';
import Navbar from "./Navbar";

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            error: "",
            success: ""
        }
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        this.setState({
            success: this.props.user.success
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            error: nextProps.login.error,
            success: nextProps.user.success
        })
    }

    login(e){
        e.preventDefault()
        const user = {
            username: this.state.username,
            password: this.state.password
        };
        this.props.loginUser(user, this.props.history)
    }
    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Navbar/>
                <h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Iniciar sesión</h1>
                <div style={{marginBottom: "auto"}}>
                    <form onSubmit={this.login} id="inputForm">
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Nombre de usuario</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({username: e.target.value, error: "", success: ""})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({password: e.target.value, error: "", success: ""})} required/>
                        </div>
                        {this.state.username === "" || this.state.password === "" ?
                            <input type="submit" value="Iniciar sesión" id="loginButtonDisabled"/> :
                            <input type="submit" value="Iniciar sesión" id="loginButton"/>}
                    </form>
                    <div id="loginAux">
                        <div style={{margin: "auto auto"}}><h7>¿No tienes una cuenta?&nbsp;</h7><Link to={'/register'}>Regístrate</Link></div>
                    </div>
                </div>
                {this.state.error !== "" ?
                    <div id="error"><h5 style={{margin: "auto auto"}}>{this.state.error}</h5></div>
                    :
                this.state.success !== "" ?
                    <div id="success"><h5 style={{margin: "auto auto"}}>{this.state.success}</h5></div>
                    :
                    <div style={{height: "8vh", backgroundColor: "#f0f0f0"}}/>
                }
            </div>
        );
    }
}


Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    user: state.user
});

export default connect(mapStateToProps, {loginUser})(withRouter(Login));