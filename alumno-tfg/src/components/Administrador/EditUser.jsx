import React from 'react';
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getUser, editUser} from '../../actions/user_actions';
import {setUser2} from '../../actions/login_action';
import Navbar from "../Navbar";

class EditUser extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email: "",
            password: ""
        }
        this.editUser = this.editUser.bind(this);
    }

    componentDidMount(){
        const id = this.props.match.params.userID;
        this.props.getUser(id);
    }

    componentWillReceiveProps(nextProps){
        const user = nextProps.user.user;
        this.setState({
            username: user.username,
            password: user.password,
            email: user.email
        })
    }

    editUser(e){
        e.preventDefault();
        const id = this.props.match.params.userID;
        const user = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        }
        this.props.editUser(user, id)
        this.props.setUser2(id)
        if(this.props.login.user.isAdmin){
            if(this.props.login.user.id == this.props.match.params.userID){
                const session = {
                    user: {
                        username: user.username,
                        isAdmin: true,
                        id: this.props.login.user.id
                    }
                }
                localStorage.setItem("session", JSON.stringify(session))
                this.props.history.push('/admin/'+this.props.login.user.id)
            } else {
                this.props.history.push('/admin/'+this.props.login.user.id+'/users')
            }
        }else{
            if(this.props.login.user.id == this.props.match.params.userID){
                const session = {
                    user: {
                        username: user.username,
                        isAdmin: false,
                        id: this.props.login.user.id
                    }
                }
                localStorage.setItem("session", JSON.stringify(session))
            }
            this.props.history.push('/user/'+this.props.login.user.id)
        }
    }
    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Navbar/>
                <div><h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Editar usuario</h1></div>
                <div style={{marginTop: "100px"}}>
                    <form onSubmit={this.editUser} id="inputForm">
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Nombre de usuario</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({username: e.target.value})} value={this.state.username} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Correo electrónico</label>
                            <input type="email" className="form-control" onChange={(e) => this.setState({email: e.target.value})} value={this.state.email} required/>
                        </div>
                        {this.state.username === "" || this.state.email === "" ?
                            <input type="submit" value="Guardar cambios" id="loginButtonDisabled"/> :
                            <input type="submit" value="Guardar cambios" id="loginButton"/>}
                    </form>
                </div>
            </div>
        );
    }
}


EditUser.propTypes = {
    getUser: PropTypes.func.isRequired,
    setUser2: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    user: state.user,
    login: state.login
});

export default connect(mapStateToProps, {getUser, editUser, setUser2})(withRouter(EditUser));