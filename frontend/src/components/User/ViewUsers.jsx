import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getUsers, deleteUser} from '../../redux/actions/user_actions';
import Navbar from "../Navbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class ViewUsers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: null,
            sort: 0
        }
        this.deleteUser = this.deleteUser.bind(this)
        this.verQuizzes = this.verQuizzes.bind(this)
        this.verGames = this.verGames.bind(this)
    }

    componentDidMount(){
        this.props.getUsers()
        this.setState({
            users: this.props.user.users
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            users: nextProps.user.users
        })
    }

    deleteUser(id, e){
        this.props.deleteUser(id, this.props.history);
        this.props.getUsers()
    }

    verQuizzes(user){
        this.props.history.push("/user/"+user.id+"/quizzes")
    }

    verGames(user){
        this.props.history.push("/user/"+user.id+"/games")
    }

    sort(users, type) {
        switch (type) {
            case 0:
                users.sort((a, b) => {return a.name.toLowerCase().localeCompare(b.name.toLowerCase())})
                return(users)
            case 1:
                users.sort((a, b) => {return a.email.toLowerCase().localeCompare(b.email.toLowerCase())})
                return(users)
            case 2:
                users.sort((a, b) => {return Date.parse(b.updatedAt) - Date.parse(a.updatedAt)})
                return(users)
            case 3:
                users.sort((a, b) => {
                    const adminA = a.isAdmin ? 1 : 0
                    const adminB = b.isAdmin ? 1 : 0
                    const diff = adminB - adminA
                    if (diff === 0) {
                        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                    } else {
                        return diff
                    }
                })
                return(users)
            default:
                return(users)
        }
    }

    time(time){
        let seconds = Math.floor(time/1000)
        let interval = Math.floor(seconds/31536000)
        if (interval >= 1) {
            return interval + " año" + (interval === 1 ? "" : "s")
        }
        interval = Math.floor(seconds/2592000)
        if (interval >= 1) {
            return interval + " mes" + (interval === 1 ? "" : "es")
        }
        interval = Math.floor(seconds/86400)
        if (interval >= 1) {
            return interval + " día" + (interval === 1 ? "" : "s")
        }
        interval = Math.floor(seconds/3600)
        if (interval >= 1) {
            return interval + " hora" + (interval === 1 ? "" : "s")
        }
        interval = Math.floor(seconds/60)
        if (interval > 1) {
            return interval + " minutos"
        }
        return "1 minuto"
    }

    render() {
        if (this.state.users !== null) {
            const users = this.sort(this.state.users, parseInt(this.state.sort))
            const userList = users.map((user) => {
                let now = new Date()
                let time = now - Date.parse(user.updatedAt)
                return(
                    <div className="quizEntry" key={user.id}>
                        <div style={{width: "80%", display: "flex"}}>
                            <div id="userTitle1"><h5 style={{margin: "auto auto auto 20px"}}>
                                {user.isAdmin ? <i style={{marginRight: '15px'}} className="fas fa-user-cog"/> : <i style={{marginRight: '23px'}} className="fas fa-user"/>}{user.name}</h5>
                            </div>
                            <div id="userTitle2"><h5 style={{margin: "auto auto auto 20px"}}>{user.email}</h5></div>
                            <div id="userTitle3"><h6 style={{margin: "auto auto auto 20px", fontSize: '13px', color: '#3c3c3c'}}>Último inicio de sesión<br/><b>Hace {this.time(time)}</b></h6></div>
                        </div>
                        <div style={{margin: "auto auto", width: "20%", display: "flex", justifyContent: "end"}}>
                            <button id="verButton" onClick={(e) => this.verQuizzes(user)}>Quizzes</button>
                            <button id="verButton" onClick={(e) => this.verGames(user)}>Juegos</button>
                            {user.isAdmin ? <button className="btn fas fa-trash-alt" id="forbiddenButton"/> :
                                <button className="btn fas fa-trash-alt" id="deleteButton" onClick={(e) => this.deleteUser(user.id, e)}/>}
                        </div>
                    </div>
                )
            });

            return(
                <div style={{minHeight: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                    <Navbar/>
                    <h1 id="header">Usuarios</h1>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                            <div style={{margin: "auto auto auto 5%"}}>
                                Ordenar por: &nbsp;&nbsp;&nbsp;
                                <select id="sortBy" style={{width: '160px'}} onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                                    <option value="0">Nombre</option>
                                    <option value="1">Correo electrónico</option>
                                    <option value="2">Última conexión</option>
                                    <option value="3">Rol</option>
                                </select>
                            </div>
                        </div>
                        <div style={{width: "95%", margin: "20px auto"}}>
                            {userList}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Backdrop style={{color: "black", zIndex: "1"}} open={true}>
                        <CircularProgress style={{color: "white"}} size={80} />
                    </Backdrop>
                </div>
            )
        }
    }
}


ViewUsers.propTypes = {
    getUsers: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, {getUsers, deleteUser})(withRouter(ViewUsers));