import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import io from 'socket.io-client'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {connect} from 'react-redux';
import {checkGame, joinGame, resetPlayError} from '../redux/actions/play_actions'
import Navbar from "./Navbar";

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            accessId: 0,
            checked: null,
            nickname: "",
            r: Math.floor(Math.random()*4)
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitNickname = this.onSubmitNickname.bind(this);
        this.closeAlert = this.closeAlert.bind(this)
    }

    componentDidMount() {
        this.socket = io('/')
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.game.game.status !== undefined && nextProps.game.game.status === 1) {
            this.props.history.push('/game/'+nextProps.game.game.id)
        }
        this.setState({
            checked: nextProps.play.checked
        })
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetPlayError()
    }

    onSubmit(e){
        e.preventDefault();
        const accessId = this.state.accessId;
        const token = this.props.login.user.token || null
        this.props.checkGame(accessId, token)
        document.getElementById("form").reset()
    }

    onSubmitNickname(e){
        e.preventDefault();
        const request = {
            nickname: this.state.nickname,
            accessId: this.state.accessId,
            userId: this.props.login.authenticated ? this.props.login.user.id : null
        }
        this.props.joinGame(request, this.socket)
    }

    render(){
        let colors = ["#79de4f", "#46b4a0", "#e5cc3c", "#f18d5f"]
        if(this.state.checked === null){
            return(
                <div style={{height: "100vh", backgroundColor: colors[this.state.r], display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Navbar/>
                    <div style={{margin: "auto auto", display: "flex", flexDirection: "column", maxWidth: "25vw"}}>
                        <form id="form" onSubmit={this.onSubmit}>
                            <input type="number" autocomplete="off" placeholder="PIN del juego" id="inputPin" onChange={(e) => this.setState({accessId: e.target.value})}/>
                            <input id="pinButton" type="submit" value="Aceptar"/>
                        </form>
                    </div>
                    <Snackbar open={this.props.play.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                        <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                            {this.props.play.error}
                        </MuiAlert>
                    </Snackbar>
                </div>
            )
        }else {
            return (
                <div style={{height: "100vh", backgroundColor: colors[this.state.r], display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <Navbar/>
                    <div style={{margin: "auto auto", display: "flex", flexDirection: "column", maxWidth: "25vw"}}>
                        <form id="form" onSubmit={this.onSubmitNickname}>
                            <input type="text" autocomplete="off" placeholder="Nombre" maxLength="35" id="inputName" onChange={(e) => this.setState({nickname: e.target.value})}/>
                            <input id="pinButton" type="submit" value="Aceptar"/>
                        </form>
                    </div>
                    <Snackbar open={this.props.play.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                        <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                            {this.props.play.error}
                        </MuiAlert>
                    </Snackbar>
                </div>
            )
        }
    }
}

Main.propTypes = {
    checkGame: PropTypes.func.isRequired,
    joinGame: PropTypes.func.isRequired,
    resetPlayError: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    play: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    play: state.play,
    game: state.game
});

export default connect(mapStateToProps, {checkGame, joinGame, resetPlayError})(withRouter(Main));