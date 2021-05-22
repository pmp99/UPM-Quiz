import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import io from 'socket.io-client'
import {getPlayer, setNickname, resetCheckedGame} from '../redux/actions/play_actions'
import {getGame, deletePlayerByName, setGame} from '../redux/actions/game_actions'
import square from '../assets/square.svg'
import diamond from '../assets/diamond.svg'
import circle from '../assets/circle.svg'
import triangle from '../assets/triangle.svg'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class Play extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            questions: null,
            currentQuestion: 0,
            status: null,
            answerSubmitted: null,
            score: 0,
            roundScore: 0,
            cancel: false
        }
        this.onAnswer = this.onAnswer.bind(this)
        this.end = this.end.bind(this)
    }

    componentDidMount(){
        if (this.props.game.game.status === undefined || this.props.game.game.status === 0 || (this.props.game.game.status === 3 && this.props.game.game.currentQuestion >= this.props.game.game.quiz.questions.length - 1)) {
            this.props.history.push('/')
            return
        } else {
            window.addEventListener("beforeunload", this.handleWindowBeforeUnload.bind(this))
            this.props.getPlayer(this.props.play.user, this.props.game.game.id)
            this.setState({
                questions: this.props.game.game.quiz.questions,
                currentQuestion: this.props.game.game.currentQuestion
            })
        }
        if (!this.props.login.authenticated) {
            localStorage.setItem('nickname', this.props.play.user)
        }
        this.socket = io('/')
        this.socket.emit('joinRoom', this.props.match.params.gameID)
        this.socket.on('refreshStatus', () => {
            const gameId = this.props.match.params.gameID
            this.props.getGame(gameId)
            this.props.getPlayer(this.props.play.user, gameId)
        })
        this.socket.on('cancelGame', () => {
            this.setState({
                cancel: true
            },
                () => {this.props.history.push('/')})
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            currentQuestion: nextProps.game.game.currentQuestion,
            status: nextProps.game.game.status,
            answerSubmitted: nextProps.play.player.answerSubmitted,
            roundScore: nextProps.play.player.roundScore,
            score: nextProps.play.player.score
        })
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.handleWindowBeforeUnload.bind(this))
        this.props.resetCheckedGame()
        if (this.state.status === 0 || (this.state.status === 3 && this.state.currentQuestion >= this.state.questions.length - 1)) {
            localStorage.removeItem('nickname')
        }
        if (this.state.status === 1 && !this.state.cancel) {
            const gameId = this.props.match.params.gameID;
            this.props.deletePlayerByName(this.props.play.user, gameId)
            this.socket.emit('joinGame', gameId)
        }
        this.props.setGame({})
        this.props.setNickname("")
        if (this.socket !== undefined) {
            this.socket.emit('leaveRoom', this.props.match.params.gameID)
        }
    }

    handleWindowBeforeUnload() {
        if (this.state.status === 0 || (this.state.status === 3 && this.state.currentQuestion >= this.state.questions.length - 1)) {
            localStorage.removeItem('nickname')
        }
    }

    onAnswer(num, e){
        e.preventDefault()
        this.socket.emit('answerSubmit', {answer: num, user: this.props.play.user}, this.props.match.params.gameID)
    }

    end(){
        localStorage.removeItem('nickname')
        this.props.history.push('/')
    }

    render() {
        if (this.state.questions !== null) {
            let acierto = true
            let id = ""
            if (this.state.questions[this.state.currentQuestion] !== undefined) {
                acierto = this.state.answerSubmitted !== null && (JSON.parse(this.state.questions[this.state.currentQuestion].correctAnswer).includes(this.state.answerSubmitted))
            }
            id = acierto ? "correcto" : "incorrecto"
            const estilo = {
                textAlign: "center",
                padding: "30px",
                color: "white"
            }
            let navbar = () => {
                return(
                    <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "white", borderBottom: "2px solid black"}}>
                        <h4 style={{marginTop: "auto", marginBottom: "auto", padding: "8px"}}>{this.state.currentQuestion+1} de {this.state.questions.length}</h4>
                        <h4 style={{padding: "8px 15px", marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}>{this.props.play.user}</h4>
                        <h4 style={{margin: "8px", padding: "4px", border: "2px solid black", color: "white", backgroundColor: "#282828", borderRadius: "10px", textAlign: "center"}}>{this.state.answerSubmitted !== null && this.state.status === 2 ? this.state.score-this.state.roundScore : this.state.score}</h4>
                    </nav>
                )
            }
            let navbar_v2 = () => {
                return(
                    <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "white", borderBottom: "2px solid black"}}>
                        <h4 style={{marginTop: "auto", marginBottom: "auto", padding: "8px"}}>{this.state.questions.length} pregunta{this.state.questions.length === 1 ? null : 's'}</h4>
                        <h4 style={{padding: "8px", marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}>{this.props.play.user}</h4>
                    </nav>
                )
            }

            if (this.state.status === 1) {
                return(
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", width: "100vw", backgroundColor: "#61bb32"}}>
                        {navbar_v2()}
                        <h1 style={{textAlign: "center", marginTop: "250px", color: "white"}}>¡Estás dentro!</h1>
                        <h2 style={{textAlign: "center", marginTop: "25px", color: "white", marginBottom: "auto"}}>¿Ves tu nombre en la pantalla?</h2>
                    </div>
                )
            } else if (this.state.status === 2 && this.state.answerSubmitted === null) {
                return(
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", width: "100vw"}}>
                        {navbar()}
                        <div className="questionRow">
                            <div className="respuestas-button"><button onClick={(e) => this.onAnswer(0, e)} className="respuestas-button" id="respuesta-0"><img style={{margin: "auto auto"}} src={triangle} alt="Triángulo"/></button></div>
                            <div className="respuestas-button"><button onClick={(e) => this.onAnswer(1, e)} className="respuestas-button" id="respuesta-1"><img style={{margin: "auto auto"}} src={diamond} alt="Rombo"/></button></div>
                        </div>
                        {this.state.questions[this.state.currentQuestion].answer2 !== "" || this.state.questions[this.state.currentQuestion].answer3 !== "" ?
                            <div className="questionRow">
                                {this.state.questions[this.state.currentQuestion].answer2 === "" ? null :
                                    <div className="respuestas-button"><button onClick={(e) => this.onAnswer(2, e)} className="respuestas-button" id="respuesta-2"><img style={{margin: "auto auto"}} src={circle} alt="Círculo"/></button></div>
                                }
                                {this.state.questions[this.state.currentQuestion].answer3 === "" ?
                                    <div className="respuestas-button" id="respuesta-vacia"/> :
                                    <div className="respuestas-button"><button onClick={(e) => this.onAnswer(3, e)} className="respuestas-button" id="respuesta-3"><img style={{margin: "auto auto"}} src={square} alt="Cuadrado"/></button></div>
                                }
                            </div>
                            : null}
                    </div>
                )
            } else if (this.state.status === 2 && this.state.answerSubmitted !== null) {
                return(
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", width: "100vw", backgroundColor: "#b83e8a"}}>
                        {navbar()}
                        <h1 style={{textAlign: "center", marginTop: "250px", color: "white", marginBottom: "auto"}}>Esperando al resto de jugadores...</h1>
                    </div>
                )
            } else if (this.state.status === 0 || (this.state.status === 3 && this.state.currentQuestion >= this.state.questions.length - 1)) {
                return(
                    <div id={id}>
                        {navbar()}
                        {acierto ? <h1 style={estilo}>CORRECTO</h1> : <h1 style={estilo}>INCORRECTO</h1>}
                        {acierto ? <h1 style={estilo}><i className="fas fa-check"/></h1> : <h1 style={estilo}><i className="fas fa-times"/></h1>}
                        {acierto ? <h3 style={estilo}>+ {this.state.roundScore}</h3> : null}
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px"}}><button className="btn btn-dark" onClick={this.end}>Salir</button></div>
                    </div>
                )
            } else if (this.state.status === 3 || this.state.status === 4) {
                return(
                    <div id={id}>
                        {navbar()}
                        {acierto ? <h1 style={estilo}>CORRECTO</h1> : <h1 style={estilo}>INCORRECTO</h1>}
                        {acierto ? <h1 style={estilo}><i className="fas fa-check"/></h1> : <h1 style={estilo}><i className="fas fa-times"/></h1>}
                        {acierto ? <h3 style={estilo}>+ {this.state.roundScore}</h3> : null}
                    </div>
                )
            } else {
                return(
                    <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <Backdrop style={{color: "black", zIndex: "1"}} open={true}>
                            <CircularProgress style={{color: "white"}} size={80} />
                        </Backdrop>
                    </div>
                )
            }

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

Play.propTypes = {
    getGame: PropTypes.func.isRequired,
    setGame: PropTypes.func.isRequired,
    getPlayer: PropTypes.func.isRequired,
    setNickname: PropTypes.func.isRequired,
    deletePlayerByName: PropTypes.func.isRequired,
    play: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    play: state.play,
    game: state.game,
    login: state.login
});

export default connect(mapStateToProps, {getGame, deletePlayerByName, setGame, getPlayer, setNickname, resetCheckedGame})(withRouter(Play));