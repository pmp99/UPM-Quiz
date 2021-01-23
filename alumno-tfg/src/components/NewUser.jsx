import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {newUser} from '../actions/user_actions';
import Navbar from "./Navbar";

class NewUser extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            error: ""
        }
        this.newUser = this.newUser.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            error: nextProps.user.error
        })
    }

    newUser(e){
        e.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        }
        this.props.newUser(user, this.props.history)
    }
    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Navbar/>
                <h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Crear una cuenta</h1>
                <div style={{marginBottom: "auto"}}>
                    <form onSubmit={this.newUser} id="inputForm">
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Nombre de usuario</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({username: e.target.value, error: ""})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Correo electrónico</label>
                            <input type="email" className="form-control" onChange={(e) => this.setState({email: e.target.value, error: ""})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Contraseña</label>
                            <input type="password" className="form-control" onChange={(e) => this.setState({password: e.target.value, error: ""})} required/>
                        </div>
                        {this.state.username === "" || this.state.password === "" || this.state.email === "" ?
                            <input type="submit" value="Crear cuenta" id="loginButtonDisabled"/> :
                            <input type="submit" value="Crear cuenta" id="loginButton"/>}
                    </form>
                    <div id="loginAux">
                        <div style={{margin: "auto auto"}}><h7>¿Ya tienes una cuenta?&nbsp;</h7><Link to={'/login'}>Inicia sesión</Link></div>
                    </div>
                </div>
                {this.state.error === "" ?
                    <div style={{height: "8vh", backgroundColor: "#f0f0f0"}}/>
                    :
                    <div id="error"><h5 style={{margin: "auto auto"}}>{this.state.error}</h5></div>
                }
            </div>
        );
    }
}


NewUser.propTypes = {
    newUser: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  login: state.login,
  user: state.user
});

export default connect(mapStateToProps, {newUser})(withRouter(NewUser));