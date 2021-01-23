import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getQuiz} from '../../actions/quiz_actions'
import {deleteQuestion} from '../../actions/question_actions'
import {createGame} from '../../actions/game_actions'
import Navbar from "../Navbar";
import empty from '../../assets/empty.jpg'
import square from '../../assets/square.svg'
import diamond from '../../assets/diamond.svg'
import circle from '../../assets/circle.svg'
import triangle from '../../assets/triangle.svg'

class ViewQuiz extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            preguntas: [],
            answersId: ""
        }
        this.delQuestion = this.delQuestion.bind(this)
        this.createGame = this.createGame.bind(this)
        this.showAnswers = this.showAnswers.bind(this)
    }

    componentDidMount(){
        const quizId = this.props.match.params.quizID;
        this.props.getQuiz(quizId);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            preguntas: nextProps.quiz.quiz.pregunta
        })
    }

    componentWillUnmount() {
        this.setState({
            answersId: ""
        })
    }

    delQuestion(id){
        const quizId = this.props.match.params.quizID
        this.props.deleteQuestion(id, quizId);
    }

    createGame(e){
        e.preventDefault();
        const quizId = this.props.match.params.quizID;
        const userId = this.props.match.params.userID;
        this.props.createGame(quizId, userId, this.props)
    }

    showAnswers(id){
        if (this.state.answersId === id) {
            this.setState({
                answersId: ""
            })
        } else {
            this.setState({
                answersId: id
            })
        }
    }

    render() {
        const pr = this.state.preguntas;
        if (pr !== undefined) {
            const preguntasList = pr.map((pregunta) => {
                const editLink = '/user/'+this.props.login.user.id+'/quizzes/'+this.props.quiz.quiz.id+'/edit/'+pregunta.id;
                let image = pregunta.image
                if (image === "") {
                    image = empty
                }
                let id = "questionEntry"
                if (this.state.answersId === pregunta.id) {
                    id = "questionEntryExpand"
                }
                let id2 = "answersExpand4"
                if (pregunta.answer3 === "" || pregunta.answer2 === "") {
                    if (pregunta.answer2 !== "") {
                        id2 = "answersExpand3"
                    } else {
                        id2 = "answersExpand2"
                    }
                }

                return(
                    <tr key={pregunta.id} id="quizCell">
                        <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                        <div id={id}>
                            <button key={pregunta.id} id="questionEntryButton" onClick={this.showAnswers.bind(this, pregunta.id)}>
                                <div style={{height: "100%", width: "240px", marginRight: "auto", marginLeft: "0"}}><img src={image} style={{width: "100%", height: "100%"}}/></div>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%"}}>
                                    <h4 id="questionTitle">{pregunta.question}</h4>
                                    <h6 style={{backgroundColor: "#8c8c8c", borderRadius: "4px", padding: "5px", width: "120px", color: "white", margin: "10px"}}>{pregunta.time} segundos</h6>
                                </div>
                            </button>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", width: "70px"}}>
                                <button className="btn fas fa-pencil-alt" id="editButtonBig" onClick={(e) => this.props.history.push(editLink)}/>
                                <button className="btn fas fa-trash-alt" id="deleteButtonBig" onClick={(e) => this.delQuestion(pregunta.id)}/>
                            </div>
                        </div>
                        {this.state.answersId !== pregunta.id ? null :
                        <div id={id2}>
                            <div style={{display: "flex", width: "100%", height: "70px", borderTop: "0.5px solid darkgray", justifyContent: "space-between"}}>
                                <div style={{minWidth: "40px", minHeight: "40px", margin: "auto 15px auto 15px", borderRadius: "5px", display: "flex"}} id="respuesta-0">
                                    <img src={triangle} style={{width: "30px", height: "30px", margin: "auto auto"}}/></div>
                                <div style={{display: "flex", maxHeight: "100%", width: "100%", margin: "auto 0 auto 0"}}><h4 style={{margin: "5px auto 5px 0", overflow: "auto", maxHeight: "90%"}}>{pregunta.answer0}</h4></div>
                                {pregunta.correctAnswer === 0 ? <div style={{margin: "auto 20px auto 20px", fontSize: "20px", color: "green"}}><i className="fas fa-check"/></div> :
                                    <div style={{margin: "auto 23px auto 23px", fontSize: "20px", color: "red"}}><i className="fas fa-times"/></div>}
                            </div>
                            <div style={{display: "flex", width: "100%", height: "70px", borderTop: "0.5px solid darkgray", justifyContent: "space-between"}}>
                                <div style={{minWidth: "40px", minHeight: "40px", margin: "auto 15px auto 15px", borderRadius: "5px", display: "flex"}} id="respuesta-1">
                                    <img src={diamond} style={{width: "30px", height: "30px", margin: "auto auto"}}/></div>
                                <div style={{display: "flex", maxHeight: "100%", width: "100%", margin: "auto 0 auto 0"}}><h4 style={{margin: "5px auto 5px 0", overflow: "auto", maxHeight: "90%"}}>{pregunta.answer1}</h4></div>
                                {pregunta.correctAnswer === 1 ? <div style={{margin: "auto 20px auto 20px", fontSize: "20px", color: "green"}}><i className="fas fa-check"/></div> :
                                    <div style={{margin: "auto 23px auto 23px", fontSize: "20px", color: "red"}}><i className="fas fa-times"/></div>}
                            </div>
                            {pregunta.answer2 !== "" ?
                                <div style={{display: "flex", width: "100%", height: "70px", borderTop: "0.5px solid darkgray", justifyContent: "space-between"}}>
                                    <div style={{minWidth: "40px", minHeight: "40px", margin: "auto 15px auto 15px", borderRadius: "5px", display: "flex"}} id="respuesta-2">
                                        <img src={circle} style={{width: "30px", height: "30px", margin: "auto auto"}}/></div>
                                    <div style={{display: "flex", maxHeight: "100%", width: "100%", margin: "auto 0 auto 0"}}><h4 style={{margin: "5px auto 5px 0", overflow: "auto", maxHeight: "90%"}}>{pregunta.answer2}</h4></div>
                                    {pregunta.correctAnswer === 2 ? <div style={{margin: "auto 20px auto 20px", fontSize: "20px", color: "green"}}><i className="fas fa-check"/></div> :
                                        <div style={{margin: "auto 23px auto 23px", fontSize: "20px", color: "red"}}><i className="fas fa-times"/></div>}
                                </div> : null}
                            {pregunta.answer3 !== "" ?
                                <div style={{display: "flex", width: "100%", height: "70px", borderTop: "0.5px solid darkgray", justifyContent: "space-between"}}>
                                    <div style={{minWidth: "40px", minHeight: "40px", margin: "auto 15px auto 15px", borderRadius: "5px", display: "flex"}} id="respuesta-3">
                                        <img src={square} style={{width: "30px", height: "30px", margin: "auto auto"}}/></div>
                                    <div style={{display: "flex", maxHeight: "100%", width: "100%", margin: "auto 0 auto 0"}}><h4 style={{margin: "5px auto 5px 0", overflow: "auto", maxHeight: "90%"}}>{pregunta.answer3}</h4></div>
                                    {pregunta.correctAnswer === 3 ? <div style={{margin: "auto 20px auto 20px", fontSize: "20px", color: "green"}}><i className="fas fa-check"/></div> :
                                        <div style={{margin: "auto 23px auto 23px", fontSize: "20px", color: "red"}}><i className="fas fa-times"/></div>}
                                </div> : null}
                        </div>
                        }
                        </div>
                    </tr>
                )
            });
            const addLink = '/user/'+this.props.match.params.userID+'/quizzes/'+this.props.match.params.quizID+'/add'
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Navbar/>
                    <h1 style={{textAlign: "center", padding: "10px"}}>{this.props.quiz.quiz.name}</h1>
                    {pr.length === 0 ?
                        <div style={{textAlign: "center"}}>
                            <h3 style={{textAlign: "center", padding: "30px"}}>No hay preguntas</h3>
                            {this.props.login.user.id == this.props.match.params.userID ?
                                <h5>Pulsa <Link to={addLink}>aquí</Link> para crear una nueva pregunta</h5> : null}
                        </div> :
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                                {this.props.login.user.id == this.props.match.params.userID ?
                                    <div style={{margin: "auto auto auto 5%"}}><Link to={addLink}><i
                                        className="fas fa-plus"/> Crear pregunta</Link></div> : null}
                                <div style={{margin: "auto 5% auto auto"}}>
                                    {this.props.login.user.id == this.props.match.params.userID && this.state.preguntas.length > 0 ?
                                        <button onClick={this.createGame} id="playQuizButtonBig">Jugar</button> :
                                        <button onClick={this.createGame} id="forbiddenButtonBig">Jugar</button>}
                                </div>
                            </div>
                            <table style={{width: "95%", margin: "20px auto auto"}}>
                                <tbody>
                                {preguntasList}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            );
        } else {
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <h1 style={{textAlign: "center", padding: "10px"}}>CARGANDO</h1>
                </div>
            )
        }
    }
}

ViewQuiz.propTypes = {
    getQuiz: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    createGame: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, {getQuiz, deleteQuestion, createGame})(withRouter(ViewQuiz));