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
            users: null
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

    render() {
        if (this.state.users !== null) {
            const userList = this.state.users.map((user) => {
                return(
                    <div className="quizEntry" key={user.id}>
                        <div style={{width: "70%", display: "flex"}}>
                            <div  id="userTitle1"><h5 style={{margin: "auto auto auto 20px"}}>{user.name}</h5></div>
                            <div  id="userTitle2"><h5 style={{margin: "auto auto auto 20px"}}>{user.email}</h5></div>
                        </div>
                        <div style={{margin: "auto auto", width: "30%", display: "flex", justifyContent: "end"}}>
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
                    <div style={{width: "95%", margin: "20px auto"}}>
                        {userList}
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