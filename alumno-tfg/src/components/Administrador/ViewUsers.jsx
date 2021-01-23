import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getUsers, deleteUser} from '../../actions/user_actions';
import Navbar from "../Navbar";

class ViewUsers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: []
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
        if (user.isAdmin) {
            this.props.history.push("/admin/"+user.id+"/quizzes")
        } else {
            this.props.history.push("/user/"+user.id+"/quizzes")
        }
    }

    verGames(user){
        if (user.isAdmin) {
            this.props.history.push("/admin/"+user.id+"/games")
        } else {
            this.props.history.push("/user/"+user.id+"/games")
        }
    }

    render() {
        const userList = this.state.users.map((user) => {
            const editLink = "/edit/"+user.id
            return(
                <tr key={user.id} id="quizCell">
                    <div id="quizEntry">
                        <div style={{width: "70%", display: "flex"}}>
                            <div  id="userTitle1"><h5 style={{margin: "auto auto auto 20px"}}>{user.username}</h5></div>
                            <div  id="userTitle2"><h5 style={{margin: "auto auto auto 20px"}}>{user.email}</h5></div>
                        </div>
                        <div style={{margin: "auto auto", width: "30%", display: "flex", justifyContent: "end"}}>
                            <button id="verButton" onClick={(e) => this.verQuizzes(user)}>Kahoots</button>
                            <button id="verButton" onClick={(e) => this.verGames(user)}>Juegos</button>
                            <button className="btn fas fa-pencil-alt" id="editButton" onClick={(e) => this.props.history.push(editLink)}/>
                            {user.isAdmin ? <button className="btn fas fa-trash-alt" id="forbiddenButton"/> :
                            <button className="btn fas fa-trash-alt" id="deleteButton" onClick={(e) => this.deleteUser(user.id, e)}/>}
                        </div>
                    </div>
                </tr>
            )
        });

        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
            <Navbar/>
                <h1 style={{textAlign: "center", padding: "10px"}}>Usuarios</h1>
                <table style={{width: "95%", margin: "20px auto auto"}}>
                    <tbody>
                        {userList}
                    </tbody>
                </table>
            </div>
        );
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