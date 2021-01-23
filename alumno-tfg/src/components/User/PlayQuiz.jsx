import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Redirect, Prompt} from 'react-router-dom';
import io from 'socket.io-client'
import {connect} from 'react-redux';
import {getGame, startGame, toggleLockGame, deleteGame} from '../../actions/game_actions'
import kahootWhite from "../../assets/kahootWhite.png";

class PlayQuiz extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            quizName: "",
            accessId: 0,
            questions: [],
            alumnos: [],
            started: false,
            locked: false,
            error: "",
            salir: false
        }
        this.start = this.start.bind(this)
        this.salir = this.salir.bind(this)
        this.toggleLock = this.toggleLock.bind(this)
        this.timeouts = []
    }

    componentDidMount(){
        onbeforeunload = e => "No te vayas"
        const gameId = this.props.game.game.id;
        const quizId = this.props.match.params.quizID;
        this.props.getGame(gameId, quizId);
        this.socket = io('/');
        this.socket.on('join-game', e => {
            this.props.getGame(gameId, this.props.game.quiz.id);
            this.setState({
                alumnos: this.props.game.game.alumnos
            })
        })
    }

    componentWillUnmount() {
        onbeforeunload = null
        if (!this.state.started) {
            const gameId = this.props.game.game.id;
            this.props.deleteGame(gameId)
            this.socket.emit('cancel-game')
        }
    }


    componentWillReceiveProps(nextProps){
        this.setState({
            quizName: nextProps.game.quiz.name,
            accessId: nextProps.game.game.accessId,
            questions: nextProps.game.quiz.pregunta,
            alumnos: nextProps.game.game.alumnos,
            locked: nextProps.game.game.locked,
            error: ""
        })
    }

    start(){
        if(this.state.alumnos.length < 1){
            this.setState({
                error: "Se requiere al menos un jugador para empezar"
            })
            this.timeouts.map((timeout) => {clearTimeout(timeout)})
            this.timeouts.push(setTimeout(() =>{
                this.setState({
                    error: ""
                })
            }, 2000));
        }else{
            this.setState({
                started: true
            })
            const gameId = this.props.game.game.id;
            this.props.startGame(gameId)
            this.socket.emit('start-game')
        }
    }

    toggleLock(){
        const gameId = this.props.game.game.id;
        this.props.toggleLockGame(gameId)
    }

    salir(){
        this.setState({
            salir: true
        },
            () => {this.props.history.push('/')})
    }

    render() {
        const alumnos = this.state.alumnos;
        if (alumnos !== undefined) {
            const alumnosList = alumnos.map((alumno) => {
                return(
                    <div key={alumno.id} style={{textAlign: "center", width: "33.333%", display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "10px"}}>
                        <div>
                            <h4 style={{margin: "auto auto", color: "white", backgroundColor: "rgba(60,60,60,0.7)", borderRadius: "5px", padding: "8px 15px"}}>{alumno.username}</h4>
                        </div>
                    </div>
                )
            })
            const startLink = '/user/'+this.props.match.params.userID+'/quizzes/'+this.props.match.params.quizID+'/playing'
            return(
                <div>
                    <Prompt when={!this.state.started && !this.state.salir} message={"Si abandonas se eliminará el juego"}/>
                    {
                        !this.state.started
                            ?
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "start", height: "100vh", width: "100vw", backgroundColor: "#421886"}}>
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
                            {this.state.error === "" ?
                                <div style={{height: "8vh", backgroundColor: "#421886", justifySelf: "end"}}/>
                                :
                                <div id="error"><h5 style={{margin: "auto auto", justifySelf: "end"}}>{this.state.error}</h5></div>
                            }
                            </div>
                            :
                            <Redirect to={startLink}/>
                    }
                </div>
            )
        } else {
            return (
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <h1 style={{textAlign: "center", padding: "10px"}}>CARGANDO</h1>
                </div>
            )
        }
    }
}


PlayQuiz.propTypes = {
    getGame: PropTypes.func.isRequired,
    startGame: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
    toggleLockGame: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    questions: PropTypes.object.isRequired,
    quiz: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    questions: state.questions,
    quiz: state.quiz,
    login: state.login,
    game: state.game
});

export default connect(mapStateToProps, {getGame, startGame, toggleLockGame, deleteGame})(withRouter(PlayQuiz));