import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {withRouter, Prompt} from 'react-router-dom'
import io from 'socket.io-client'
import {checkStarted, getScore} from '../actions/play_actions'
import {getGame, deleteAlumnoByName} from '../actions/game_actions'
import square from '../assets/square.svg'
import diamond from '../assets/diamond.svg'
import circle from '../assets/circle.svg'
import triangle from '../assets/triangle.svg'

class Play extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            started: false,
            currentQuestion: 0,
            answerSub: false,
            questionEnd: false,
            quizEnd: false,
            answer: 0,
            preguntas: [],
            score: 0,
            roundScore: 0,
            cancel: false
        }
        this.onAnswer = this.onAnswer.bind(this)
        this.end = this.end.bind(this)
    }

    componentDidMount(){
        onbeforeunload = e => "No te vayas"
        //Cantor pairing inverse function
        const z = this.props.match.params.gameQuizID;
        const w = Math.floor((Math.sqrt(8*z+1)-1)/2)
        const t = (w*(w+1))/2
        const quizId = z-t
        const gameId = w-quizId
        this.props.getGame(gameId, quizId);
        this.setState({
            score: 0,
            roundScore: 0,
            started: false,
            currentQuestion: 0
        })
        this.socket = io('/')
        this.socket.on('game-started', () => {
            this.setState({
                started: true
            })
        })
        this.socket.on('end-question', () => {
            this.props.getScore(this.props.play.user, gameId)
            this.setState({
                questionEnd: true
            })
        })
        this.socket.on('next-question', () => {
            this.setState({
                currentQuestion: this.state.currentQuestion + 1,
                questionEnd: false,
                answerSub: false
            })
        })
        this.socket.on('end-game', () => {
            this.setState({
                quizEnd: true,
                started: false
            })
        })
        this.socket.on('cancel-game', async () => {
            this.setState({
                cancel: true
            },
                () => {this.props.history.push('/')})
        })
    }

    componentWillUnmount() {
        onbeforeunload = null
        if (!this.state.started && !this.state.quizEnd && !this.state.cancel) {
            //Cantor pairing inverse function
            const z = this.props.match.params.gameQuizID;
            const w = Math.floor((Math.sqrt(8*z+1)-1)/2)
            const t = (w*(w+1))/2
            const quizId = z-t
            const gameId = w-quizId
            this.props.deleteAlumnoByName(this.props.play.user, gameId)
            this.socket.emit('join-game')
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            preguntas: nextProps.game.quiz.pregunta,
            roundScore: nextProps.play.roundScore,
            score: nextProps.play.score
        })
    }

    onAnswer(num, e){
        e.preventDefault()
        this.setState({
            answerSub: true,
            answer: num
        })
        this.socket.emit('answer-submit', {answer: num, user: this.props.play.user})
    }

    end(){
        this.props.history.push('/')
    }

    render() {
        let acierto = true
        let id = ""
        if (this.state.preguntas[this.state.currentQuestion] !== undefined) {
            acierto = (this.state.preguntas[this.state.currentQuestion].correctAnswer === this.state.answer) && this.state.answerSub
        }
        if (acierto) {
            id = "correcto"
        } else {
            id = "incorrecto"
        }
        const estilo = {
            textAlign: "center",
            padding: "30px",
            color: "white"
        }
        let navbar = () => {
            return(
                <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "white", borderBottom: "2px solid black"}}>
                    <h4 style={{marginTop: "auto", marginBottom: "auto", padding: "8px"}}>{this.state.currentQuestion+1} de {this.state.preguntas.length}</h4>
                    <h4 style={{padding: "8px 15px", marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}>{this.props.play.user}</h4>
                    <h4 style={{margin: "8px", padding: "4px", border: "2px solid black", color: "white", backgroundColor: "#282828", borderRadius: "10px", textAlign: "center"}}>{this.state.score}</h4>
                </nav>
            )
        }
        let navbar_v2 = () => {
            return(
                <nav style={{display: "flex", justifyContent: "space-between", backgroundColor: "white", borderBottom: "2px solid black"}}>
                    <h4 style={{marginTop: "auto", marginBottom: "auto", padding: "8px"}}>{this.state.preguntas.length} pregunta{this.state.preguntas.length === 1 ? null : 's'}</h4>
                    <h4 style={{padding: "8px", marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}>{this.props.play.user}</h4>
                </nav>
            )
        }

        return(
            <div>
                <Prompt when={!this.state.quizEnd && !this.state.cancel} message={"Si abandonas contará como si no has participado"}/>
                {
                    !this.state.started && !this.state.questionEnd && !this.state.quizEnd
                        ?
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", width: "100vw", backgroundColor: "#61bb32"}}>
                            {navbar_v2()}
                            <h1 style={{textAlign: "center", marginTop: "250px", color: "white"}}>You're in!</h1>
                            <h2 style={{textAlign: "center", marginTop: "25px", color: "white", marginBottom: "auto"}}>See your nickname on screen?</h2>
                        </div>
                        :
                        this.state.started && !this.state.answerSub && !this.state.questionEnd
                            ?
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", width: "100vw"}}>
                                {navbar()}
                                <div className="questionRow">
                                    <div className="respuestas-button"><button onClick={(e) => this.onAnswer(0, e)} className="respuestas-button" id="respuesta-0"><img style={{margin: "auto auto"}} src={triangle}/></button></div>
                                    <div className="respuestas-button"><button onClick={(e) => this.onAnswer(1, e)} className="respuestas-button" id="respuesta-1"><img style={{margin: "auto auto"}} src={diamond}/></button></div>
                                </div>
                                {this.state.preguntas[this.state.currentQuestion].answer2 !== "" || this.state.preguntas[this.state.currentQuestion].answer3 !== "" ?
                                <div className="questionRow">
                                    {this.state.preguntas[this.state.currentQuestion].answer2 === "" ? null :
                                        <div className="respuestas-button"><button onClick={(e) => this.onAnswer(2, e)} className="respuestas-button" id="respuesta-2"><img style={{margin: "auto auto"}} src={circle}/></button></div>
                                    }
                                    {this.state.preguntas[this.state.currentQuestion].answer3 === "" ?
                                        <div className="respuestas-button" id="respuesta-vacia"/> :
                                        <div className="respuestas-button"><button onClick={(e) => this.onAnswer(3, e)} className="respuestas-button" id="respuesta-3"><img style={{margin: "auto auto"}} src={square}/></button></div>
                                    }
                                </div>
                                    : null}
                            </div>
                            :
                            this.state.started && this.state.answerSub && !this.state.questionEnd
                                ?
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", width: "100vw", backgroundColor: "#b83e8a"}}>
                                    {navbar()}
                                    <h1 style={{textAlign: "center", marginTop: "250px", color: "white", marginBottom: "auto"}}>Did u answer too fast?</h1>
                                </div>
                                :
                                this.state.started && this.state.questionEnd
                                    ?
                                    <body id={id}>
                                    {navbar()}
                                    {acierto ? <h1 style={estilo}>CORRECTO</h1> : <h1 style={estilo}>INCORRECTO</h1>}
                                    {acierto ? <h1 style={estilo}><i className="fas fa-check"/></h1> : <h1 style={estilo}><i className="fas fa-times"/></h1>}
                                    {acierto ? <h3 style={estilo}>+ {this.state.roundScore}</h3> : <h3 style={estilo}/>}
                                    </body>
                                    :
                                    this.state.quizEnd
                                        ?
                                        <body id={id}>
                                        {navbar()}
                                        {acierto ? <h1 style={estilo}>CORRECTO</h1> : <h1 style={estilo}>INCORRECTO</h1>}
                                        {acierto ? <h1 style={estilo}><i className="fas fa-check"/></h1> : <h1 style={estilo}><i className="fas fa-times"/></h1>}
                                        {acierto ? <h3 style={estilo}>+ {this.state.roundScore}</h3> : <h3 style={estilo}/>}
                                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}><button className="btn btn-dark" onClick={this.end}>Salir</button></div>
                                        </body>
                                        :
                                        <div>
                                            <h1>Algo ha ido mal</h1>
                                        </div>
                }
            </div>
        )
    }
}

Play.propTypes = {
    checkStarted: PropTypes.func.isRequired,
    getGame: PropTypes.func.isRequired,
    getScore: PropTypes.func.isRequired,
    deleteAlumnoByName: PropTypes.func.isRequired,
    play: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    questions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    play: state.play,
    game: state.game,
    questions: state.questions
});

export default connect(mapStateToProps, {checkStarted, getGame, getScore, deleteAlumnoByName})(withRouter(Play));