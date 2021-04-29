import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getQuizzes, setQuiz, addQuizzesRemoved, getQuizzesRemoved, getQuiz, createQuiz, editQuiz} from '../../redux/actions/quiz_actions'
import {createGame} from '../../redux/actions/game_actions'
import {getCourses, getAssignments} from '../../redux/actions/moodle_actions'
import Navbar from "../Navbar";
import DialogAssociate from "./DialogAssociate";
import DialogAssignment from "./DialogAssignment";
import Button from "@material-ui/core/Button";
import DialogQuiz from "./DialogQuiz";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class ViewQuizzes extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            quizzes: null,
            quizzesRemoved: null,
            quiz: {},
            sort: 0,
            courses: [],
            assignments: [],
            associateDialogOpen: false,
            assignmentDialogOpen: false,
            quizDialogOpen: false,
            gameSettings: {
                associate: false,
                course: 0,
                assignment: 0,
                min: 0,
                max: 0,
                nQuestions: 0
            },
            editMode: false,
            newQuizName: ""
        }
        this.deleteQuizzes = this.deleteQuizzes.bind(this)
        this.createGame = this.createGame.bind(this)
        this.handleCloseAssociateDialog = this.handleCloseAssociateDialog.bind(this)
        this.handleChangeCourses = this.handleChangeCourses.bind(this)
        this.handleCloseAssignmentsDialog = this.handleCloseAssignmentsDialog.bind(this)
        this.handleChangeAssignments = this.handleChangeAssignments.bind(this)
        this.handleChangeMin = this.handleChangeMin.bind(this)
        this.handleChangeMax = this.handleChangeMax.bind(this)
        this.handleCloseQuizDialog = this.handleCloseQuizDialog.bind(this)
        this.handleChangeQuiz = this.handleChangeQuiz.bind(this)
    }

    componentDidMount(){
        const id = this.props.match.params.userID
        this.props.getQuizzes(id)
        this.props.getQuizzesRemoved(id);
        if (this.props.login.user.id === parseInt(this.props.match.params.userID)) {
            this.props.getCourses(this.props.login.user.id, this.props.login.user.token)
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.game.game.status !== undefined && nextProps.game.game.status === 1) {
            this.props.history.push('/user/'+this.props.login.user.id+'/quizzes/'+this.state.quiz.id+'/play')
        }
        this.setState({
            quizzes: nextProps.quiz.quizzes,
            quizzesRemoved: nextProps.quiz.quizzesRemoved.map((element) => {
                return element.quizId
            }),
            courses: nextProps.moodle.courses,
            assignments: nextProps.moodle.assignments
        })
    }

    deleteQuizzes(id, e){
        const userId = this.props.match.params.userID;
        this.props.addQuizzesRemoved(userId, id);
    }

    createGame(quizId, e) {
        e.preventDefault();
        const quiz = this.state.quizzes.find((quiz) => {return quiz.id === quizId})
        this.setState({
            associateDialogOpen: true,
            quiz: quiz,
            gameSettings: {
                ...this.state.gameSettings,
                max: quiz.questions.length,
                nQuestions: quiz.questions.length
            }
        })
    }

    openQuiz(editMode, quizId){
        if (editMode) {
            const oldQuiz = this.state.quizzes.find((quiz) => {return quiz.id === quizId})
            const newQuizName = oldQuiz.name
            this.setState({
                newQuizName: newQuizName,
                editMode: editMode,
                quiz: oldQuiz,
                quizDialogOpen: true
            })
        } else {
            this.setState({
                newQuizName: "",
                editMode: editMode,
                quizDialogOpen: true
            })
        }
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
            if (this.state.assignment !== 0) {
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

    handleCloseQuizDialog(value, editMode){
        if (value) {
            this.setState({
                quizDialogOpen: false
            }, () => {
                const quizName = this.state.newQuizName
                if (editMode) {
                    const quizId = this.state.quiz.id
                    this.props.editQuiz(quizId, quizName, this.props)
                } else {
                    const owner = this.props.login.user.id
                    this.props.createQuiz(quizName, owner, this.props)
                }
            })
        } else {
            this.setState({
                quizDialogOpen: false
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
            if (this.state.course !== 0) {
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

    handleChangeQuiz(value){
        this.setState({
            newQuizName: value
        })
    }

    time(time){
        let seconds = Math.floor(time/1000)
        let interval = Math.floor(seconds/31536000)
        if (interval >= 1) {
            return interval + " año" + (interval === 1 ? "" : "s")
        }
        interval = Math.floor(seconds/2592000)
        if (interval >= 1) {
            return interval + " mes" + (interval === 1 ? "" : "es")
        }
        interval = Math.floor(seconds/86400)
        if (interval >= 1) {
            return interval + " día" + (interval === 1 ? "" : "s")
        }
        interval = Math.floor(seconds/3600)
        if (interval >= 1) {
            return interval + " hora" + (interval === 1 ? "" : "s")
        }
        interval = Math.floor(seconds/60)
        if (interval > 1) {
            return interval + " minutos"
        }
        return "1 minuto"
    }

    sort(quizzes, type) {
        switch (type) {
            case 0:
                quizzes.sort((a, b) => {return Date.parse(b.createdAt) - Date.parse(a.createdAt)})
                return(quizzes)
            case 1:
                quizzes.sort((a, b) => {return Date.parse(a.createdAt) - Date.parse(b.createdAt)})
                return(quizzes)
            case 2:
                quizzes.sort((a, b) => {return b.timesPlayed-a.timesPlayed})
                return(quizzes)
            case 3:
                quizzes.sort((a, b) => {return a.name.toLowerCase().localeCompare(b.name.toLowerCase())})
                return(quizzes)
            case 4:
                quizzes.sort((a, b) => {return b.name.toLowerCase().localeCompare(a.name.toLowerCase())})
                return(quizzes)
            default:
                return(quizzes)
        }
    }


    render() {
        let quizzes = this.state.quizzes
        let quizzesRemoved = this.state.quizzesRemoved
        if (quizzes !== null && quizzesRemoved !== null) {
            quizzes = quizzes.filter((quiz) => {return !quizzesRemoved.includes(quiz.id)})
            quizzes = this.sort(quizzes, parseInt(this.state.sort))
            const quizzesList = quizzes.map((quiz) => {
                const viewLink = '/user/'+this.props.match.params.userID+'/quizzes/'+quiz.id
                let now = new Date()
                let time = now - Date.parse(quiz.createdAt)
                return(
                    <td key={quiz.id} className="quizCell">
                        <div id="quizEntry">
                            <Link to={viewLink} onClick={() => this.props.setQuiz(quiz)} id="quizEntryLink"><h5 id="quizTitle">{quiz.name}</h5></Link>
                            <div style={{margin: "auto auto", width: "320px", textAlign: "center", display: "flex", flexDirection: "column"}}>
                                {quiz.questions.length} pregunta{quiz.questions.length === 1 ? null : 's'}
                                <div style={{color: "gray", fontSize: "11px"}}>Creado hace {this.time(time)} <b>- Jugado: {quiz.timesPlayed}</b></div>
                            </div>
                            {this.props.login.user.id === parseInt(this.props.match.params.userID) && quiz.questions.length > 0 ?
                            <button className="btn fas fa-play" id="playQuizButton" onClick={(e) => this.createGame(quiz.id, e)}/> :
                                <button className="btn fas fa-play" id="forbiddenPlayButton"/>}
                            <button className="btn fas fa-pencil-alt" id="editButton" onClick={this.openQuiz.bind(this, true, quiz.id)}/>
                            <button className="btn fas fa-trash-alt" id="deleteButton" onClick={(e) => this.deleteQuizzes(quiz.id, e)}/>
                        </div>
                    </td>
                )
            });

            return(
                <div style={{minHeight: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Navbar/>
                    <h1 id="header">Kahoots</h1>
                    {quizzes.length === 0 ?
                        <div style={{textAlign: "center"}}>
                            <h3 style={{textAlign: "center", padding: "30px"}}>No hay kahoots</h3>
                            {this.props.login.user.id === parseInt(this.props.match.params.userID) ?
                                <Button onClick={this.openQuiz.bind(this, false, null)} color="primary" variant="contained">Crear kahoot</Button> : null}
                        </div> :
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                                {this.props.login.user.id === parseInt(this.props.match.params.userID) ?
                                    <div style={{margin: "auto auto auto 5%"}}>
                                        <Button onClick={this.openQuiz.bind(this, false, null)} color="primary" variant="contained">Crear kahoot</Button>
                                    </div> : null}
                                <div style={{margin: "auto 5% auto auto"}}>
                                    Ordenar por: &nbsp;&nbsp;&nbsp;
                                    <select id="sortBy" onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                                        <option value="0">Más reciente</option>
                                        <option value="1">Más antiguo</option>
                                        <option value="2">Más jugado</option>
                                        <option value="3">Nombre (a-z)</option>
                                        <option value="4">Nombre (z-a)</option>
                                    </select>
                                </div>
                            </div>
                            <table style={{width: "95%", margin: "20px auto auto"}}>
                                <tbody>
                                {quizzesList}
                                </tbody>
                            </table>
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
                    <DialogQuiz open={this.state.quizDialogOpen}
                                    name={this.state.newQuizName}
                                    edit={this.state.editMode}
                                    handleClose={this.handleCloseQuizDialog}
                                    handleChange={this.handleChangeQuiz}
                    />
                </div>
            );
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


ViewQuizzes.propTypes = {
    getQuizzes: PropTypes.func.isRequired,
    setQuiz: PropTypes.func.isRequired,
    getCourses: PropTypes.func.isRequired,
    getAssignments: PropTypes.func.isRequired,
    getQuiz: PropTypes.func.isRequired,
    createQuiz: PropTypes.func.isRequired,
    createGame: PropTypes.func.isRequired,
    addQuizzesRemoved: PropTypes.func.isRequired,
    getQuizzesRemoved: PropTypes.func.isRequired,
    editQuiz: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    quiz: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    moodle: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    quiz: state.quiz,
    login: state.login,
    game: state.game,
    moodle: state.moodle
});

export default connect(mapStateToProps, {getQuizzes, setQuiz, addQuizzesRemoved, getQuizzesRemoved, createQuiz, editQuiz, createGame, getQuiz, getCourses, getAssignments})(withRouter(ViewQuizzes));