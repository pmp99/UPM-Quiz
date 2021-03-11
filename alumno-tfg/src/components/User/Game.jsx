import React from 'react';
import PropTypes, {number} from 'prop-types'
import {Prompt, withRouter} from 'react-router-dom';
import io from 'socket.io-client'
import {connect} from 'react-redux';
import {getQuiz} from '../../actions/quiz_actions'
import {setPositions} from '../../actions/play_actions'
import {getGame, endGame, deleteGame, grades} from '../../actions/game_actions'
import {endQuestion, submitAnswer} from '../../actions/question_actions'
import Preguntas from './Preguntas';
import Respuestas from './Respuestas';
import Results from './Results';
import RoundResults from './RoundResults';

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            quiz: {},
            game: {},
            preguntas: [],
            currentQuestion: 0,
            end: false,
            tiempoTimer: 0,
            questionEnd: false,
            scoreboard: false,
            start: false,
            answers: [0, 0, 0, 0],
            nAnswers: 0,
            nAlumnos: -1,
            skip: false,
            salir: false
        }
        this.nextQuestion = this.nextQuestion.bind(this)
        this.viewScoreboard = this.viewScoreboard.bind(this)
        this.skip = this.skip.bind(this)
        this.endGame = this.endGame.bind(this)
        this.salir = this.salir.bind(this)
        this.timer = setInterval(() =>{
            this.modifyTimer()
        }, 1000);
    }

    componentDidMount(){
        onbeforeunload = e => "No te vayas"
        this.props.getGame(this.props.game.game.id, this.props.match.params.quizID)
        this.setState({
            start: true
        })
        this.socket = io('/')
        this.socket.on('answer-submit', (data) => {
            let ans = this.state.answers
            ans[data.answer] += 1
            this.setState(function (state) {
                return {
                    nAnswers: state.nAnswers + 1,
                    answers: ans
                }
            })
            if (this.state.currentQuestion < this.state.preguntas.length) {
                const pregunta = {
                    id: this.state.preguntas[this.state.currentQuestion].id,
                    quizId: this.props.game.quiz.id,
                    totalTime: this.state.preguntas[this.state.currentQuestion].time,
                    remainingTime: this.state.tiempoTimer
                }
                this.props.submitAnswer(data, pregunta, this.props.game.game.id)
            }
        })
        this.socket.on('join-game', e => {
            const gameId = this.props.game.game.id;
            this.props.getGame(gameId, this.props.game.quiz.id);
        })
    }

    componentWillUnmount() {
        onbeforeunload = null
        if (this.state.salir) {
            this.endGame()
        }
        if (!this.state.end) {
            const gameId = this.props.game.game.id;
            this.props.deleteGame(gameId)
            this.socket.emit('cancel-game')
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            quiz: nextProps.game.quiz,
            game: nextProps.game.game,
            preguntas: nextProps.game.quiz.pregunta,
            nAlumnos: nextProps.game.game.alumnos.length
        }, () => {
            if (this.state.nAlumnos === 0) {
                this.salir()
            }
        })
        if(this.state.preguntas.length > this.state.currentQuestion){
            this.setState({
                tiempoTimer: nextProps.game.quiz.pregunta[this.state.currentQuestion].time
            })
        }
    }

    modifyTimer(){
        if(!this.state.end && !this.state.questionEnd){
            if(this.state.tiempoTimer <= 0){
                if(this.state.preguntas.length > this.state.currentQuestion){
                    this.socket.emit('end-question', this.state.game.accessId)
                    this.props.endQuestion(this.state.quiz.id, this.state.preguntas[this.state.currentQuestion].id)
                    this.setState(function (state) {
                        return {
                            currentQuestion: state.currentQuestion + 1,
                            questionEnd: true
                        }
                    })
                    if(this.state.preguntas.length === this.state.currentQuestion){
                        this.setState({
                            end: true
                        })
                        this.socket.emit('end-game')
                        if (this.state.game.assignmentId !== null) {
                            this.props.grades(this.state.game.id, this.props.login.user.token)
                        }
                    }
                    this.props.setPositions(this.state.game.id)
                }
            } else {
                // Si ya han respondido todos o se salta la pregunta, ponemos el temporizador a un número negativo
                if (this.state.nAnswers >= this.state.nAlumnos || this.state.skip) {
                    this.setState({
                        tiempoTimer: Number.MIN_SAFE_INTEGER
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

    nextQuestion(){
        this.setState({
            questionEnd: false,
            scoreboard: false,
            answers: [0, 0, 0, 0],
            nAnswers: 0,
            skip: false
        })
        if(this.state.preguntas.length > this.state.currentQuestion){
            this.setState({
                tiempoTimer: this.props.game.quiz.pregunta[this.state.currentQuestion].time
            })
        }
        this.socket.emit('next-question', this.state.quiz.accessId)
    }

    viewScoreboard(){
        this.setState({
            scoreboard: true
        })
    }

    skip(){
        this.setState({
            skip: true
        })
    }

    endGame(){
        this.props.endGame(this.state.game.id, this.state.quiz.id, this.props)
    }

    salir(){
        this.setState({
                salir: true
            },
            () => {this.props.history.push('/')})
    }

    render() {
        if(!(this.state.end || this.state.questionEnd)){
            return(
                <div>
                    <Prompt when={!this.state.salir} message={"Si abandonas se eliminará el juego"}/>
                    <Preguntas pregunta={this.state.preguntas[this.state.currentQuestion]} tiempo={this.state.tiempoTimer} n={this.state.nAnswers} skip={this.skip}/>
                </div>
            );
        } else {
            if (!this.state.scoreboard) {
                return(
                    <div>
                        <Prompt when={!this.state.salir} message={"Si abandonas se eliminará el juego"}/>
                        <Respuestas pregunta={this.state.preguntas[this.state.currentQuestion-1]} answers={this.state.answers} next={this.viewScoreboard} salir={this.salir}/>
                    </div>
                )
            } else {
                if (this.state.end) {
                    return(
                        <div>
                            <Results gameId={this.state.game.id} quizId={this.state.quiz.id} end={this.endGame}/>
                        </div>
                    )
                } else {
                    return(
                        <div>
                            <Prompt when={!this.state.salir} message={"Si abandonas se eliminará el juego"}/>
                            <RoundResults gameId={this.state.game.id} quizId={this.state.quiz.id} nextQuestion={this.nextQuestion}/>
                        </div>
                    )
                }
            }
        }
    }
}


Game.propTypes = {
    submitAnswer: PropTypes.func.isRequired,
    setPositions: PropTypes.func.isRequired,
    endGame: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
    endQuestion: PropTypes.func.isRequired,
    getQuiz: PropTypes.func.isRequired,
    getGame: PropTypes.func.isRequired,
    grades: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    questions: PropTypes.object.isRequired,
    quiz: PropTypes.object.isRequired,
    play: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    questions: state.questions,
    quiz: state.quiz,
    play: state.quiz,
    login: state.login,
    game: state.game
});

export default connect(mapStateToProps, {getQuiz, getGame, endQuestion, endGame, submitAnswer, setPositions, deleteGame, grades})(withRouter(Game));