import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import io from 'socket.io-client'
import {connect} from 'react-redux';
import {checkGame, joinGame} from '../actions/play_actions'
import Navbar from "./Navbar";

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            accessId: 0,
            checked: false,
            nickname: "",
            error: "",
            r: Math.floor(Math.random()*4)
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitNickname = this.onSubmitNickname.bind(this);
        this.timeouts = []
        this.checkingError = false
    }

    componentDidMount(){
        this.setState({
            accessId: 0,
            nickname: "",
            checked: false
        })
        this.socket = io('/')
        this.socket.on('quiz-started', e => {
            console.log('Quiz Started')
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            error: nextProps.play.error,
            checked: nextProps.play.checked
        })
    }

    componentWillUnmount() {
        this.setState({
            checked: false
        })
    }

    onSubmit(e){
        e.preventDefault();
        this.setState({
            error: ""
        })
        const accessId = this.state.accessId;
        this.props.checkGame(accessId)
        document.getElementById("form").reset()
    }

    onSubmitNickname(e){
        e.preventDefault();
        const request = {
            nickname: this.state.nickname,
            accessId: this.state.accessId,
            userId: this.props.login.authenticated ? this.props.login.user.id : null
        }
        this.props.joinGame(request, this.props.history)
        this.socket.emit('player-join')
        this.socket.emit('join-game')
    }

    manageErrors(){
        this.checkingError = true
        this.timeouts.map((timeout) => {clearTimeout(timeout)})
        this.timeouts.push(setTimeout(() =>{
            this.setState({
                error: ""
            })
        }, 2000));
    }


    render(){
        if (this.state.error !== "" && !this.checkingError) {
            this.manageErrors()
        }
        let colors = ["#79de4f", "#46b4a0", "#e5cc3c", "#f18d5f"]
        if(!this.state.checked){
            return(
                <div style={{height: "100vh", backgroundColor: colors[this.state.r], display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Navbar/>
                    <div style={{margin: "auto auto", display: "flex", flexDirection: "column", maxWidth: "25vw"}}>
                        <form id="form" onSubmit={this.onSubmit}>
                            <input type="number" placeholder="PIN del juego" id="inputPin" onChange={(e) => this.setState({accessId: e.target.value, error: ""})}/>
                            <input id="pinButton" type="submit" value="Aceptar"/>
                        </form>
                    </div>
                    {this.state.error === "" ?
                        <div style={{height: "8vh", backgroundColor: colors[this.state.r]}}/>
                        :
                        <div id="error"><h5 style={{margin: "auto auto"}}>{this.state.error}</h5></div>
                    }
                </div>
            )
        }else {
            return (
                <div style={{height: "100vh", backgroundColor: colors[this.state.r], display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <Navbar/>
                    <div style={{margin: "auto auto", display: "flex", flexDirection: "column", maxWidth: "25vw"}}>
                        <form id="form" onSubmit={this.onSubmitNickname}>
                            <input type="text" placeholder="Nombre" maxLength="35" id="inputName" onChange={(e) => this.setState({nickname: e.target.value, error: ""})}/>
                            <input id="pinButton" type="submit" value="Aceptar"/>
                        </form>
                    </div>
                    {this.state.error === "" ?
                        <div style={{height: "8vh", backgroundColor: colors[this.state.r]}}/>
                        :
                        <div id="error"><h5 style={{margin: "auto auto"}}>{this.state.error}</h5></div>
                    }
                </div>
            )
        }
    }
}

Main.propTypes = {
    login: PropTypes.object.isRequired,
    checkGame: PropTypes.func.isRequired,
    joinGame: PropTypes.func.isRequired,
    play: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    play: state.play
});

export default connect(mapStateToProps, {checkGame, joinGame})(withRouter(Main));