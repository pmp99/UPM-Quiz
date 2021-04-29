import React from 'react';
import PropTypes from 'prop-types'
import {Prompt, withRouter} from 'react-router-dom';
import io from 'socket.io-client'
import {connect} from 'react-redux';
import {getQuiz} from '../../redux/actions/quiz_actions'
import {setPositions, resetSubmitAnswer} from '../../redux/actions/play_actions'
import {getGame, deleteGame, grades, setStatus, setGame} from '../../redux/actions/game_actions'
import {submitAnswer} from '../../redux/actions/question_actions'
import Preguntas from './Preguntas';
import Respuestas from './Respuestas';
import Results from './Results';
import RoundResults from './RoundResults';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            game: {},
            preguntas: [],
            nAlumnos: null,
            currentQuestion: 0,
            status: null,
            tiempoTimer: 0,
            answers: [0, 0, 0, 0],
            nAnswers: 0,
            skip: false
        }
        this.playNextQuestion = this.playNextQuestion.bind(this)
        this.viewScoreboard = this.viewScoreboard.bind(this)
        this.skip = this.skip.bind(this)
        this.endGame = this.endGame.bind(this)
        this.salir = this.salir.bind(this)
        this.timer = setInterval(() =>{
            this.modifyTimer()
        }, 1000);
    }

    componentDidMount(){
        if (this.props.game.game.status === undefined || this.props.game.game.status === 0 || this.props.game.game.status === 1) {
            this.props.history.push('/')
        } else {
            this.setState({
                game: this.props.game.game,
                preguntas: this.props.game.game.quiz.questions,
                nAlumnos: this.props.game.game.players.length,
                currentQuestion: this.props.game.game.currentQuestion,
                status: this.props.game.game.status,
                tiempoTimer: this.props.game.game.quiz.questions[this.state.currentQuestion].time
            })
        }
        this.socket = io('/')
        this.socket.emit('joinRoom', this.props.game.game.id)
        this.socket.on('answerSubmit', (data) => {
            if (this.state.status === 2) {
                let ans = this.state.answers
                ans[data.answer] += 1
                this.setState(function (state) {
                    return {
                        nAnswers: state.nAnswers + 1,
                        answers: ans
                    }
                })
                const pregunta = {
                    id: this.state.preguntas[this.state.currentQuestion].id,
                    totalTime: this.state.preguntas[this.state.currentQuestion].time,
                    remainingTime: this.state.tiempoTimer
                }
                this.props.submitAnswer(data, pregunta, this.state.game.id, this.socket)
            }
        })
        this.socket.on('joinGame', e => {
            const gameId = this.state.game.id
            this.props.getGame(gameId)
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            game: nextProps.game.game,
            nAlumnos: this.props.game.game.players.length,
            currentQuestion: nextProps.game.game.currentQuestion,
            status: nextProps.game.game.status
        }, () => {
            if (this.state.nAlumnos === 0) {
                this.salir()
            }
        })
        if (this.state.currentQuestion < this.state.preguntas.length){
            this.setState({
                tiempoTimer: nextProps.game.game.quiz.questions[this.state.currentQuestion].time
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        this.props.setGame({})
        if (this.socket !== undefined) {
            this.socket.emit('leaveRoom', this.props.game.game.id)
        }
    }

    modifyTimer(){
        if (this.state.status === 2){
            if (this.state.tiempoTimer <= 0){
                this.setState({
                    tiempoTimer: 0
                },
                    () => {
                        this.props.setPositions(this.state.game.id)
                        this.props.setStatus(this.state.game.id, 3, this.socket)
                        if (this.state.currentQuestion >= this.state.preguntas.length - 1){
                            if (this.state.game.assignmentId !== null) {
                                this.props.grades(this.state.game.id, this.props.login.user.token)
                            }
                        }
                    })
            } else {
                // Si ya han respondido todos o se salta la pregunta, ponemos el temporizador a 0
                if (this.state.nAnswers >= this.state.nAlumnos || this.state.skip) {
                    this.setState({
                        tiempoTimer: 0
                    })
                } else {
                    this.setState(function (state) {
                        return {
                            tiempoTimer: state.tiempoTimer - 1
                        }
                    })
                }
            }
        }
    }

    playNextQuestion(){
        this.setState({
            answers: [0, 0, 0, 0],
            nAnswers: 0,
            skip: false,
            tiempoTimer: this.state.preguntas[this.state.currentQuestion].time
        },
            () => {this.props.setStatus(this.state.game.id, 2, this.socket)})
    }

    viewScoreboard(){
        const gameId = this.state.game.id
        if (this.state.currentQuestion < this.state.preguntas.length - 1) {
            this.props.setStatus(gameId, 4, this.socket)
        } else {
            this.props.setStatus(gameId, 0, this.socket)
        }
        this.props.resetSubmitAnswer(gameId)
    }

    skip(){
        this.setState({
            skip: true
        })
    }

    endGame(){
        this.props.history.push('/')
    }

    salir(){
        if (this.state.currentQuestion < this.state.preguntas.length - 1) {
            this.socket.emit('cancelGame', this.state.game.id)
        }
        this.props.setStatus(this.state.game.id, 0, null)
        this.props.history.push('/')
    }

    render() {
        if (this.state.status !== null) {
            if(this.state.status === 2){
                return(
                    <div>
                        <Preguntas pregunta={this.state.preguntas[this.state.currentQuestion]} tiempo={this.state.tiempoTimer} n={this.state.nAnswers} skip={this.skip}/>
                    </div>
                )
            } else if (this.state.status === 3) {
                return(
                    <div>
                        <Respuestas pregunta={this.state.preguntas[this.state.currentQuestion]} answers={this.state.answers} next={this.viewScoreboard} salir={this.salir}/>
                    </div>
                )
            } else if (this.state.status === 4) {
                return(
                    <div>
                        <RoundResults gameId={this.state.game.id} nextQuestion={this.playNextQuestion}/>
                    </div>
                )
            } else if (this.state.status === 0) {
                return(
                    <div>
                        <Results gameId={this.state.game.id} end={this.endGame}/>
                    </div>
                )
            }
        } else {
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Backdrop style={{color: "black", zIndex: "1"}} open={true}>
                        <CircularProgress style={{color: "white"}} size={80} />
                    </Backdrop>
                </div>
            )
        }
    }
}


Game.propTypes = {
    submitAnswer: PropTypes.func.isRequired,
    setPositions: PropTypes.func.isRequired,
    endGame: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    resetSubmitAnswer: PropTypes.func.isRequired,
    getQuiz: PropTypes.func.isRequired,
    getGame: PropTypes.func.isRequired,
    setGame: PropTypes.func.isRequired,
    grades: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    play: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    play: state.play,
    login: state.login,
    game: state.game
});

export default connect(mapStateToProps, {getQuiz, getGame, setGame, setStatus, submitAnswer, setPositions, deleteGame, grades, resetSubmitAnswer})(withRouter(Game));