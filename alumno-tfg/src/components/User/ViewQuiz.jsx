import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import {deleteQuestion, editQuestion, newQuestion} from '../../redux/actions/question_actions'
import {resetQuizError, setQuizError} from "../../redux/actions/quiz_actions";
import {createGame} from '../../redux/actions/game_actions'
import {getCourses, getAssignments} from '../../redux/actions/moodle_actions'
import Navbar from "../Navbar";
import DialogAssociate from "./DialogAssociate";
import DialogAssignment from "./DialogAssignment";
import DialogQuestion from "./DialogQuestion";
import DialogInfoImport from "./DialogInfoImport";
import empty from '../../assets/empty.jpg'
import square from '../../assets/square.svg'
import diamond from '../../assets/diamond.svg'
import circle from '../../assets/circle.svg'
import triangle from '../../assets/triangle.svg'
import HelpIcon from '@material-ui/icons/Help';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class ViewQuiz extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            quiz: null,
            selectedQuestion: "",
            courses: [],
            assignments: [],
            associateDialogOpen: false,
            assignmentDialogOpen: false,
            questionDialogOpen: false,
            infoImportDialogOpen: false,
            editMode: false,
            gameSettings: {
                associate: false,
                course: 0,
                assignment: 0,
                min: 0,
                max: 0,
                nQuestions: 0
            },
            newQuestion: {
                question: "",
                answer0: "",
                answer1: "",
                answer2: "",
                answer3: "",
                correct: [],
                time: 5,
                file: "",
                imageSrc: ""
            },
            selectedEditQuestion: ""
        }
        this.delQuestion = this.delQuestion.bind(this)
        this.createGame = this.createGame.bind(this)
        this.showAnswers = this.showAnswers.bind(this)
        this.importQuestions = this.importQuestions.bind(this)
        this.handleCloseAssociateDialog = this.handleCloseAssociateDialog.bind(this)
        this.handleChangeCourses = this.handleChangeCourses.bind(this)
        this.handleCloseAssignmentsDialog = this.handleCloseAssignmentsDialog.bind(this)
        this.handleChangeAssignments = this.handleChangeAssignments.bind(this)
        this.handleChangeMin = this.handleChangeMin.bind(this)
        this.handleChangeMax = this.handleChangeMax.bind(this)
        this.handleCloseQuestionDialog = this.handleCloseQuestionDialog.bind(this)
        this.handleChangeQuestion = this.handleChangeQuestion.bind(this)
        this.handleInfoImport = this.handleInfoImport.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
    }

    componentDidMount(){
        if (this.props.quiz.quiz.id === undefined || this.props.quiz.quiz.id !== parseInt(this.props.match.params.quizID) || this.props.quiz.quiz.userId !== parseInt(this.props.match.params.userID) || (this.props.quiz.quiz.userId !== this.props.login.user.id && !this.props.login.user.isAdmin)) {
            this.props.history.push('/user/'+this.props.login.user.id+'/quizzes')
        } else {
            if (this.props.login.user.id === parseInt(this.props.match.params.userID)) {
                this.props.getCourses(this.props.login.user.id, this.props.login.user.token)
            }
            this.setState({
                quiz: this.props.quiz.quiz
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.game.game.status !== undefined && nextProps.game.game.status === 1) {
            this.props.history.push('/user/'+this.props.login.user.id+'/quizzes/'+this.state.quiz.id+'/play')
        }
        this.setState({
            quiz: nextProps.quiz.quiz,
            courses: nextProps.moodle.courses,
            assignments: nextProps.moodle.assignments,
            gameSettings: {
                ...this.state.gameSettings,
                max: this.props.quiz.quiz.questions.length,
                nQuestions: this.props.quiz.quiz.questions.length
            }
        })
    }


    delQuestion(id){
        this.props.deleteQuestion(id);
    }

    importQuestions(e){
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            let lines = text.split('\n')
            lines = lines.map((line) => {
                if (line !== "") {
                    return line.trim()
                }
            })
            lines = lines.filter((line) => {return line !== undefined})
            let questions = []
            const questionModel = {
                question: "",
                answer0: "",
                answer1: "",
                answer2: "",
                answer3: "",
                correct: [],
                time: 20
            }
            let question = Object.assign({}, questionModel)
            let nextLine = ""
            const getAnswer = (line) => {
                let answers = line.substring(7, lines[0].length).trim().split(',')
                answers = answers.map((answer) => {
                    switch(answer.trim()) {
                        case "A":
                            return 0
                        case "B":
                            return 1
                        case "C":
                            return 2
                        case "D":
                            return 3
                        default:
                            break
                    }
                })
                // Eliminamos posibles duplicados
                answers = [...new Set(answers)]
                question.correct = answers
                questions.push(Object.assign({}, question))
                question = Object.assign({}, questionModel)
                nextLine = ""
            }
            while (lines.length > 0) {
                if (nextLine === "") {
                    question.question = lines[0]
                    nextLine = "A"
                } else if (nextLine === "A") {
                    if (lines[0].substring(0, 2) === "A." || lines[0].substring(0, 2) === "A)") {
                        question.answer0 = lines[0].substring(2, lines[0].length).trim()
                        nextLine = "B"
                    } else {
                        this.props.setQuizError("Error al importar preguntas")
                        return
                    }
                } else if (nextLine === "B") {
                    if (lines[0].substring(0, 2) === "B." || lines[0].substring(0, 2) === "B)") {
                        question.answer1 = lines[0].substring(2, lines[0].length).trim()
                        nextLine = "C"
                    } else {
                        this.props.setQuizError("Error al importar preguntas")
                        return
                    }
                } else if (nextLine === "C") {
                    if (lines[0].substring(0, 2) === "C." || lines[0].substring(0, 2) === "C)") {
                        question.answer2 = lines[0].substring(2, lines[0].length).trim()
                        nextLine = "D"
                    } else if (lines[0].substring(0, 7) === "ANSWER:") {
                        getAnswer(lines[0])
                    } else {
                        this.props.setQuizError("Error al importar preguntas")
                        return
                    }
                } else if (nextLine === "D") {
                    if (lines[0].substring(0, 2) === "D." || lines[0].substring(0, 2) === "D)") {
                        question.answer3 = lines[0].substring(2, lines[0].length).trim()
                        nextLine = "ans"
                    } else if (lines[0].substring(0, 7) === "ANSWER:") {
                        getAnswer(lines[0])
                    } else {
                        this.props.setQuizError("Error al importar preguntas")
                        return
                    }
                } else if (nextLine === "ans") {
                    if (lines[0].substring(0, 7) === "ANSWER:") {
                        getAnswer(lines[0])
                    } else {
                        this.props.setQuizError("Error al importar preguntas")
                        return
                    }
                }
                lines.shift()
            }
            for (let i=0; i<questions.length; i++) {
                this.props.newQuestion(this.state.quiz.id, questions[i], false)
            }
        }
        reader.readAsText(e.target.files[0])
    }

    createGame(e){
        e.preventDefault();
        this.setState({
            associateDialogOpen: true
        })
    }

    openQuestion(editMode, questionId){
        if (editMode) {
            const oldQuestion = this.state.quiz.questions.find((question) => {return question.id === questionId})
            const newQuestion = {
                question: oldQuestion.question,
                answer0: oldQuestion.answer0,
                answer1: oldQuestion.answer1,
                answer2: oldQuestion.answer2,
                answer3: oldQuestion.answer3,
                correct: JSON.parse(oldQuestion.correctAnswer),
                time: oldQuestion.time,
                file: "",
                imageSrc: oldQuestion.image !== "" ? oldQuestion.image + "?" + new Date().getTime() : ""
            }
            this.setState({
                newQuestion: newQuestion,
                editMode: editMode,
                selectedEditQuestion: questionId,
                questionDialogOpen: true
            })
        } else {
            const newQuestion = {
                question: "",
                answer0: "",
                answer1: "",
                answer2: "",
                answer3: "",
                correct: [],
                time: "",
                file: "",
                imageSrc: ""
            }
            this.setState({
                newQuestion: newQuestion,
                editMode: editMode,
                questionDialogOpen: true
            })
        }
    }

    closeAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.props.resetQuizError()
    }


    handleCloseAssociateDialog(value){
        if (value !== null) {
            this.setState({
                associateDialogOpen: false,
                assignmentDialogOpen: value,
                gameSettings: {
                    ...this.state.gameSettings,
                    associate: value
                }
            }, () => {
                if (!value) {
                    this.props.createGame(this.state.quiz.id, null, null, null, null)
                }
            })
        } else {
            this.setState({
                associateDialogOpen: false
            })
        }
    }

    handleCloseAssignmentsDialog(value){
        if (value) {
            if (this.state.gameSettings.assignment !== 0) {
                this.setState({
                    assignmentDialogOpen: false
                }, () => {
                    this.props.createGame(this.state.quiz.id, this.state.gameSettings.assignment, this.state.gameSettings.course, this.state.gameSettings.min, this.state.gameSettings.max)
                })
            }
        } else {
            this.setState({
                assignmentDialogOpen: false
            })
        }
    }

    handleCloseQuestionDialog(value, editMode){
        if (value) {
            this.setState({
                questionDialogOpen: false
            }, () => {
                const changeImage = this.state.newQuestion.file !== ""
                const keepImage = this.state.newQuestion.imageSrc !== ""
                let question = this.state.newQuestion
                delete question.imageSrc
                if (editMode) {
                    const questionId = this.state.selectedEditQuestion
                    this.props.editQuestion(questionId, question, changeImage, keepImage)
                } else {
                    const quizId = this.state.quiz.id
                    this.props.newQuestion(quizId, question, changeImage)
                }
            })
        } else {
            this.setState({
                questionDialogOpen: false
            })
        }
    }

    handleChangeCourses(event){
        this.setState({
            gameSettings: {
                ...this.state.gameSettings,
                course: parseInt(event.target.value),
                assignment: 0
            }
        }, () => {
            if (this.state.gameSettings.course !== 0) {
                this.props.getAssignments(this.state.gameSettings.course, this.props.login.user.token)
            }
        })
    }

    handleChangeAssignments(event){
        this.setState({
            gameSettings: {
                ...this.state.gameSettings,
                assignment: parseInt(event.target.value)
            }
        })
    }

    handleChangeMin(value){
        this.setState({
            gameSettings: {
                ...this.state.gameSettings,
                min: value
            }
        })
    }

    handleChangeMax(value){
        this.setState({
            gameSettings: {
                ...this.state.gameSettings,
                max: value
            }
        })
    }

    handleChangeQuestion(value, type){
        if (type === 'removeImage') {
            this.setState({
                newQuestion: {
                    ...this.state.newQuestion,
                    file: "",
                    imageSrc: ""
                }
            })
        } else if (type.startsWith('correct')) {
            let correct = this.state.newQuestion.correct
            if (value) {
                correct.push(parseInt(type[type.length-1]))
                this.setState({
                    newQuestion: {
                        ...this.state.newQuestion,
                        correct: correct
                    }
                })
            } else {
                correct.splice(correct.indexOf(parseInt(type[type.length-1])), 1)
                this.setState({
                    newQuestion: {
                        ...this.state.newQuestion,
                        correct: correct
                    }
                })
            }
        } else {
            let newQuestion = this.state.newQuestion
            newQuestion[type] = value
            this.setState({
                newQuestion: newQuestion
            })
        }
    }

    showAnswers(id){
        this.setState({
            selectedQuestion: this.state.selectedQuestion === id ? "" : id
        })
    }

    handleInfoImport() {
        const current = this.state.infoImportDialogOpen
        this.setState({
            infoImportDialogOpen: !current
        })
    }

    render() {
        const quiz = this.state.quiz
        if (quiz !== null && quiz.id !== undefined) {
            const questionsList = quiz.questions.map((question) => {
                let image = question.image
                image = image === "" ? empty : image + "?" + new Date().getTime()
                let id = this.state.selectedQuestion === question.id ? "questionEntryExpand" : "questionEntry"
                let id2 = "answersExpand4"
                if (question.answer3 === "" || question.answer2 === "") {
                    id2 = question.answer2 !== "" ? "answersExpand3" : "answersExpand2"
                }
                const imageBorder = this.state.selectedQuestion !== question.id ? "6px 0 0 6px" : "6px 0 0 0"

                return(
                    <div style={{display: "flex", flexDirection: "column", width: "100%"}} id={"question" + question.id} key={question.id}>
                        <div id={id}>
                            <button key={question.id} id="questionEntryButton" onClick={this.showAnswers.bind(this, question.id)}>
                                <div style={{height: "100%", width: "240px", marginRight: "auto"}}><img src={image} style={{width: "100%", height: "100%", borderRadius: imageBorder}}/></div>
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%"}}>
                                    <h4 id="questionTitle">{question.question}</h4>
                                    <h6 style={{backgroundColor: "#8c8c8c", borderRadius: "4px", padding: "5px", width: "120px", color: "white", margin: "10px"}}>{question.time} segundos</h6>
                                </div>
                            </button>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", width: "70px"}}>
                                <button className="btn fas fa-pencil-alt" id="editButtonBig" onClick={this.openQuestion.bind(this, true, question.id)}/>
                                <button className="btn fas fa-trash-alt" id="deleteButtonBig" onClick={(e) => this.delQuestion(question.id)}/>
                            </div>
                        </div>
                        {this.state.selectedQuestion !== question.id ? null :
                        <div id={id2}>
                            <div style={{display: "flex", width: "100%", height: "70px", borderTop: "0.5px solid darkgray", justifyContent: "space-between"}}>
                                <div style={{minWidth: "40px", minHeight: "40px", margin: "auto 15px auto 15px", borderRadius: "5px", display: "flex"}} id="respuesta-0">
                                    <img src={triangle} style={{width: "30px", height: "30px", margin: "auto auto"}}/></div>
                                <div style={{display: "flex", maxHeight: "100%", width: "100%", margin: "auto 0 auto 0"}}><h4 style={{margin: "5px auto 5px 0", overflow: "auto", maxHeight: "90%"}}>{question.answer0}</h4></div>
                                {JSON.parse(question.correctAnswer).includes(0) ? <div style={{margin: "auto 20px auto 20px", fontSize: "20px", color: "green"}}><i className="fas fa-check"/></div> :
                                    <div style={{margin: "auto 23px auto 23px", fontSize: "20px", color: "red"}}><i className="fas fa-times"/></div>}
                            </div>
                            <div style={{display: "flex", width: "100%", height: "70px", borderTop: "0.5px solid darkgray", justifyContent: "space-between"}}>
                                <div style={{minWidth: "40px", minHeight: "40px", margin: "auto 15px auto 15px", borderRadius: "5px", display: "flex"}} id="respuesta-1">
                                    <img src={diamond} style={{width: "30px", height: "30px", margin: "auto auto"}}/></div>
                                <div style={{display: "flex", maxHeight: "100%", width: "100%", margin: "auto 0 auto 0"}}><h4 style={{margin: "5px auto 5px 0", overflow: "auto", maxHeight: "90%"}}>{question.answer1}</h4></div>
                                {JSON.parse(question.correctAnswer).includes(1) ? <div style={{margin: "auto 20px auto 20px", fontSize: "20px", color: "green"}}><i className="fas fa-check"/></div> :
                                    <div style={{margin: "auto 23px auto 23px", fontSize: "20px", color: "red"}}><i className="fas fa-times"/></div>}
                            </div>
                            {question.answer2 !== "" ?
                                <div style={{display: "flex", width: "100%", height: "70px", borderTop: "0.5px solid darkgray", justifyContent: "space-between"}}>
                                    <div style={{minWidth: "40px", minHeight: "40px", margin: "auto 15px auto 15px", borderRadius: "5px", display: "flex"}} id="respuesta-2">
                                        <img src={circle} style={{width: "30px", height: "30px", margin: "auto auto"}}/></div>
                                    <div style={{display: "flex", maxHeight: "100%", width: "100%", margin: "auto 0 auto 0"}}><h4 style={{margin: "5px auto 5px 0", overflow: "auto", maxHeight: "90%"}}>{question.answer2}</h4></div>
                                    {JSON.parse(question.correctAnswer).includes(2) ? <div style={{margin: "auto 20px auto 20px", fontSize: "20px", color: "green"}}><i className="fas fa-check"/></div> :
                                        <div style={{margin: "auto 23px auto 23px", fontSize: "20px", color: "red"}}><i className="fas fa-times"/></div>}
                                </div> : null}
                            {question.answer3 !== "" ?
                                <div style={{display: "flex", width: "100%", height: "70px", borderTop: "0.5px solid darkgray", justifyContent: "space-between"}}>
                                    <div style={{minWidth: "40px", minHeight: "40px", margin: "auto 15px auto 15px", borderRadius: "5px", display: "flex"}} id="respuesta-3">
                                        <img src={square} style={{width: "30px", height: "30px", margin: "auto auto"}}/></div>
                                    <div style={{display: "flex", maxHeight: "100%", width: "100%", margin: "auto 0 auto 0"}}><h4 style={{margin: "5px auto 5px 0", overflow: "auto", maxHeight: "90%"}}>{question.answer3}</h4></div>
                                    {JSON.parse(question.correctAnswer).includes(3) ? <div style={{margin: "auto 20px auto 20px", fontSize: "20px", color: "green"}}><i className="fas fa-check"/></div> :
                                        <div style={{margin: "auto 23px auto 23px", fontSize: "20px", color: "red"}}><i className="fas fa-times"/></div>}
                                </div> : null}
                        </div>
                        }
                    </div>
                )
            });

            return(
                <div style={{minHeight: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Navbar/>
                    <h1 id="header">{this.state.quiz.name}</h1>
                    {quiz.questions.length === 0 ?
                        <div style={{textAlign: "center"}}>
                            <h3 style={{textAlign: "center", padding: "30px"}}>No hay preguntas</h3>
                            {this.props.login.user.id === parseInt(this.props.match.params.userID) ?
                                <div style={{display: 'flex', justifyContent: 'center', marginTop: '75px'}}>
                                    <Button onClick={this.openQuestion.bind(this, false, null)} color="primary" variant="contained" style={{width: '200px', marginRight: '50px'}}>Crear pregunta</Button>
                                    <input
                                        accept="text"
                                        id="inputFile"
                                        onChange={this.importQuestions}
                                        type="file"
                                        style={{display: 'none'}}
                                    />
                                    <label htmlFor="inputFile" style={{margin: '0 0 0 50px', width: '200px'}}>
                                        <Button color="primary" component="span" variant="contained">Importar preguntas</Button>
                                    </label>
                                    <button onClick={this.handleInfoImport} className="infoImportButton"><HelpIcon style={{color: 'darkblue'}}/></button>
                                </div>
                                 : null}
                        </div> :
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                                {this.props.login.user.id === parseInt(this.props.match.params.userID) ?
                                    <div style={{margin: "auto auto auto 5%"}}>
                                        <Button onClick={this.openQuestion.bind(this, false, null)} color="primary" variant="contained">Crear pregunta</Button>
                                        <input
                                            accept="text"
                                            id="inputFile"
                                            onChange={this.importQuestions}
                                            type="file"
                                            style={{display: 'none'}}
                                        />
                                        <label htmlFor="inputFile">
                                            <Button style={{marginLeft: '25px', backgroundColor: 'darkorange', zIndex: "0"}} color="primary" component="span" variant="contained">Importar preguntas</Button>
                                        </label>
                                        <button onClick={this.handleInfoImport} className="infoImportButton"><HelpIcon style={{color: 'darkblue'}}/></button>
                                    </div> : null}
                                <div style={{margin: "auto 5% auto auto"}}>
                                    {this.props.login.user.id === parseInt(this.props.match.params.userID) && quiz.questions.length > 0 ?
                                        <Button onClick={this.createGame} color="primary" variant="contained" style={{backgroundColor: '#39a800'}}>Jugar</Button> :
                                        <Button id="forbiddenButtonBig">Jugar</Button>}
                                </div>
                            </div>
                            <div style={{width: "95%", margin: "20px auto"}}>
                                {questionsList}
                            </div>
                            <DialogAssociate open={this.state.associateDialogOpen} handleClose={this.handleCloseAssociateDialog}/>
                            <DialogAssignment open={this.state.assignmentDialogOpen}
                                              gameSettings={this.state.gameSettings}
                                              courses={this.state.courses}
                                              assignments={this.state.assignments}
                                              handleClose={this.handleCloseAssignmentsDialog}
                                              handleChangeCourse={this.handleChangeCourses}
                                              handleChangeAssignment={this.handleChangeAssignments}
                                              handleChangeMin={this.handleChangeMin}
                                              handleChangeMax={this.handleChangeMax}
                            />
                        </div>
                    }
                    <DialogQuestion open={this.state.questionDialogOpen}
                                    newQuestion={this.state.newQuestion}
                                    edit={this.state.editMode}
                                    handleClose={this.handleCloseQuestionDialog}
                                    handleChange={this.handleChangeQuestion}
                    />
                    <DialogInfoImport open={this.state.infoImportDialogOpen} handleClose={this.handleInfoImport}/>
                    <Snackbar open={this.props.quiz.error !== ""} autoHideDuration={3000} onClose={this.closeAlert}>
                        <MuiAlert onClose={this.closeAlert} severity="error" variant="filled">
                            {this.props.quiz.error}
                        </MuiAlert>
                    </Snackbar>
                </div>
            );
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

ViewQuiz.propTypes = {
    getCourses: PropTypes.func.isRequired,
    getAssignments: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    createGame: PropTypes.func.isRequired,
    editQuestion: PropTypes.func.isRequired,
    newQuestion: PropTypes.func.isRequired,
    resetQuizError: PropTypes.func.isRequired,
    setQuizError: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    quiz: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    moodle: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    quiz: state.quiz,
    login: state.login,
    game: state.game,
    moodle: state.moodle
});

export default connect(mapStateToProps, {deleteQuestion, createGame, getCourses, getAssignments, editQuestion, resetQuizError, setQuizError, newQuestion})(withRouter(ViewQuiz));