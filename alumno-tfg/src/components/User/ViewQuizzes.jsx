import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getQuizzes, deleteQuiz, getQuiz} from '../../actions/quiz_actions'
import {createGame} from '../../actions/game_actions'
import Navbar from "../Navbar";

class ViewQuizzes extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            quizzes: [],
            sort: 0
        }
        this.deleteQuizzes = this.deleteQuizzes.bind(this);
        this.createGame = this.createGame.bind(this)
    }

    componentDidMount(){
        const id = this.props.match.params.userID;
        this.props.getQuizzes(id);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            quizzes: nextProps.quiz.quizzes
        })
    }

    deleteQuizzes(id, e){
        this.props.deleteQuiz(id);
        const userId = this.props.match.params.userID;
        this.props.getQuizzes(userId);
    }

    createGame(quizId, e){
        e.preventDefault();
        this.props.getQuiz(quizId);
        const userId = this.props.match.params.userID;
        this.props.createGame(quizId, userId, this.props)
    }

    time(time){
        let seconds = Math.floor(time/1000)
        let interval = Math.floor(seconds/31536000)
        if (interval === 1) {
            return interval + " año"
        } else if (interval > 1) {
            return interval + " años"
        }
        interval = Math.floor(seconds/2592000)
        if (interval === 1) {
            return interval + " mes"
        } else if (interval > 1) {
            return interval + " meses"
        }
        interval = Math.floor(seconds/86400)
        if (interval === 1) {
            return interval + " día"
        } else if (interval > 1) {
            return interval + " días"
        }
        interval = Math.floor(seconds/3600)
        if (interval === 1) {
            return interval + " hora"
        } else if (interval > 1) {
            return interval + " horas"
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
        if (quizzes !== undefined) {
            quizzes = this.sort(quizzes, parseInt(this.state.sort))
            const quizList = quizzes.filter(quiz => quiz.pregunta !== undefined).map((quiz) => {
                const viewLink = '/user/'+this.props.match.params.userID+'/quizzes/'+quiz.id
                const editLink = '/user/'+this.props.match.params.userID+'/quizzes/'+quiz.id+'/edit'
                let now = new Date()
                let time = now - Date.parse(quiz.createdAt)
                return(
                    <tr key={quiz.id} id="quizCell">
                        <div id="quizEntry">
                            <Link to={viewLink} id="quizEntryLink"><h5 id="quizTitle">{quiz.name}</h5></Link>
                            <div style={{margin: "auto auto", width: "320px", textAlign: "center", display: "flex", flexDirection: "column"}}>
                                <h7>{quiz.pregunta.length} pregunta{quiz.pregunta.length === 1 ? null : 's'}</h7>
                                <div style={{color: "gray", fontSize: "11px"}}>Creado hace {this.time(time)} <b>- Jugado: {quiz.timesPlayed}</b></div>
                            </div>
                            {this.props.login.user.id == this.props.match.params.userID && quiz.pregunta.length > 0 ?
                            <button className="btn fas fa-play" id="playQuizButton" onClick={(e) => this.createGame(quiz.id, e)}/> :
                                <button className="btn fas fa-play" id="forbiddenPlayButton"/>}
                            <button className="btn fas fa-pencil-alt" id="editButton" onClick={(e) => this.props.history.push(editLink)}/>
                            <button className="btn fas fa-trash-alt" id="deleteButton" onClick={(e) => this.deleteQuizzes(quiz.id, e)}/>
                        </div>
                    </tr>
                )
            });

            const newQuizLink = "/user/"+this.props.login.user.id+"/newQuiz"
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Navbar/>
                    <h1 style={{textAlign: "center", padding: "10px"}}>Kahoots</h1>
                    {quizzes.length === 0 ?
                        <div style={{textAlign: "center"}}>
                            <h3 style={{textAlign: "center", padding: "30px"}}>No hay kahoots</h3>
                            {this.props.login.user.id == this.props.match.params.userID ? <h5>Pulsa <Link to={newQuizLink}>aquí</Link> para crear tu primer kahoot</h5> : null}
                        </div> :
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                                {this.props.login.user.id == this.props.match.params.userID ?
                                    <div style={{margin: "auto auto auto 5%"}}><Link to={newQuizLink}><i className="fas fa-plus"/> Crear kahoot</Link></div> : null}
                                <div style={{margin: "auto 5% auto auto"}}>
                                    <h7>Ordenar por: &nbsp;&nbsp;&nbsp;</h7>
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
                                {quizList}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            );
        } else {
            return (
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <h1 style={{textAlign: "center", padding: "10px"}}>CARGANDO</h1>
                </div>
            )
        }
    }
}


ViewQuizzes.propTypes = {
    getQuizzes: PropTypes.func.isRequired,
    getQuiz: PropTypes.func.isRequired,
    createGame: PropTypes.func.isRequired,
    deleteQuiz: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    quiz: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    questions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    quiz: state.quiz,
    login: state.login,
    questions: state.questions
});

export default connect(mapStateToProps, {getQuizzes, deleteQuiz, createGame, getQuiz})(withRouter(ViewQuizzes));