import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import io from 'socket.io-client'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {connect} from 'react-redux';
import {getGame, setStatus, toggleLockGame, deleteGame} from '../../redux/actions/game_actions'
import kahootWhite from "../../assets/kahootWhite.png";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class PlayQuiz extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            accessId: 0,
            alumnos: null,
            locked: false,
            error: ""
        }
        this.start = this.start.bind(this)
        this.salir = this.salir.bind(this)
        this.toggleLock = this.toggleLock.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }

    componentDidMount(){
        if (this.props.game.game.status !== 1) {
            this.props.history.push('/')
            return
        } else {
            this.setState({
                accessId: this.props.game.game.accessId,
                locked: this.props.game.game.locked,
                alumnos: this.props.game.game.players
            })
        }
        this.socket = io('/');
        this.socket.emit('joinRoom', this.props.game.game.id)
        this.socket.on('joinGame', e => {
            const gameId = this.props.game.game.id
            this.props.getGame(gameId)
        })
    }


    componentWillReceiveProps(nextProps){
        if (nextProps.game.game.status !== undefined && nextProps.game.game.status === 2) {
            const startLink = '/user/'+this.props.match.params.userID+'/quizzes/'+this.props.match.params.quizID+'/playing'
            this.props.history.push(startLink)
            return
        }
        if (nextProps.game.game.status === undefined) {
            this.props.history.push('/')
            return
        }
        this.setState({
            accessId: nextProps.game.game.accessId,
            alumnos: nextProps.game.game.players,
            locked: nextProps.game.game.locked
        })
    }

    componentWillUnmount() {
        if (this.socket !== undefined) {
            this.socket.emit('leaveRoom', this.props.game.game.id)
        }
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            error: ""
        })
    }

    start(){
        if (this.state.alumnos.length < 1){
            this.setState({
                error: "Se requiere al menos un jugador para empezar"
            })
        } else {
            const gameId = this.props.game.game.id;
            this.props.setStatus(gameId, 2, this.socket)
        }
    }

    toggleLock(){
        const gameId = this.props.game.game.id;
        this.props.toggleLockGame(gameId)
    }

    salir(){
        const gameId = this.props.game.game.id
        this.socket.emit('cancelGame', gameId)
        this.props.deleteGame(gameId, this.props.history)
    }

    render() {
        const alumnos = this.state.alumnos
        if (alumnos !== null && alumnos !== undefined) {
            const alumnosList = alumnos.map((alumno) => {
                return(
                    <div key={alumno.id} style={{textAlign: "center", width: "33.333%", display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "10px"}}>
                        <div>
                            <h4 style={{margin: "auto auto", color: "white", backgroundColor: "rgba(60,60,60,0.7)", borderRadius: "5px", padding: "8px 15px"}}>{alumno.username}</h4>
                        </div>
                    </div>
                )
            })
            return(
                <div style={{display: "flex", flexDirection: "column", justifyContent: "start", minHeight: "100vh", width: "100vw", backgroundColor: "#421886"}}>
                    <nav style={{display: "flex", justifyContent: "center", backgroundColor: "white", borderBottom: "2px solid black"}}>
                        <h2 style={{margin: "auto 0 auto auto", fontWeight: "lighter", fontSize: "40px"}}>PIN del juego:</h2>
                        {this.state.locked ? <h1 style={{margin: "auto auto auto 0", fontSize: "55px"}}>&nbsp;<i className="fas fa-lock"/></h1> :
                            <h1 style={{margin: "auto auto auto 0", fontSize: "55px"}}>&nbsp;{this.state.accessId}</h1>}
                    </nav>
                    <div style={{display: "flex", width: "100vw", justifyContent: "space-between"}}>
                        <div style={{color: "white", width: "25%", display: "flex", justifyContent: "start"}}>
                            <div style={{margin: "20px"}}>
                                <h2 style={{backgroundColor: "rgba(60,60,60,0.7)", borderRadius: "5px", padding: "10px"}}><i className="fas fa-user-alt"/>&nbsp;&nbsp;{alumnos.length}</h2>
                            </div>
                        </div>
                        <div className="navButtonPic" style={{margin: "20px auto 20px auto", width: "50%", textAlign: "center"}}><img src={kahootWhite}/></div>
                        <div style={{margin: "auto 0 auto auto", width: "25%", display: "flex", justifyContent: "end"}}>
                            <button id="exitGameButton" className="fas fa-sign-out-alt" onClick={this.salir}/>
                            {this.state.locked ? <button id="lockButton" className="fas fa-lock" onClick={this.toggleLock}/> :
                                <button id="lockButton" className="fas fa-unlock" onClick={this.toggleLock}/>}
                            <button id="startGameButton" onClick={this.start}>Empezar</button>
                        </div>
                    </div>
                    <div style={{width: "95%", margin: "20px auto auto", display: "flex", flexFlow: "wrap", justifyContent: "center"}}>
                        {alumnosList}
                    </div>
                    <Snackbar open={this.state.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                        <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                            {this.state.error}
                        </MuiAlert>
                    </Snackbar>
                </div>
            )
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


PlayQuiz.propTypes = {
    getGame: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
    toggleLockGame: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    quiz: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    quiz: state.quiz,
    login: state.login,
    game: state.game
});

export default connect(mapStateToProps, {getGame, setStatus, toggleLockGame, deleteGame})(withRouter(PlayQuiz));