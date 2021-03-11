import React from 'react';
import PropTypes from 'prop-types'
import ReactToExcel from 'react-html-table-to-excel'
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getGame, deleteAlumno, getGameUsers} from '../../actions/game_actions'
import Navbar from "../Navbar";

class ViewGame extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            alumnos: [],
            num_preguntas: 0,
            sort: 0,
            userId: 0,
            players: []
        }
        this.delAlumno = this.delAlumno.bind(this)
    }

    componentDidMount(){
        //Cantor pairing inverse function
        const z = this.props.match.params.gameQuizID;
        const w = Math.floor((Math.sqrt(8*z+1)-1)/2)
        const t = (w*(w+1))/2
        const quizId = z-t
        const gameId = w-quizId
        this.props.getGame(gameId, quizId);
        this.props.getGameUsers(gameId)
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            alumnos: nextProps.game.game.alumnos,
            num_preguntas: nextProps.game.game.nQuestions,
            userId: nextProps.game.game.userId,
            players: this.props.game.players
        })
    }

    delAlumno(id,e){
        //Cantor pairing inverse function
        const z = this.props.match.params.gameQuizID;
        const w = Math.floor((Math.sqrt(8*z+1)-1)/2)
        const t = (w*(w+1))/2
        const quizId = z-t
        const gameId = w-quizId
        this.props.deleteAlumno(id, gameId);
    }

    sort(alumnos, type) {
        switch (type) {
            case 0:
                alumnos.sort((a, b) => {return a.position-b.position})
                return(alumnos)
            case 1:
                alumnos.sort((a, b) => {return b.aciertos-a.aciertos})
                return(alumnos)
            case 2:
                alumnos.sort((a, b) => {return a.username.toLowerCase().localeCompare(b.username.toLowerCase())})
                return(alumnos)
            case 3:
                alumnos.sort((a, b) => {return b.username.toLowerCase().localeCompare(a.username.toLowerCase())})
                return(alumnos)
            default:
                return(alumnos)
        }
    }

    render() {
        let alumnos = this.state.alumnos;
        if (alumnos !== undefined && this.state.userId > 0) {
            if (this.props.login.user.id === this.state.userId || (this.props.login.user.isAdmin && this.props.match.params.userID != this.props.login.user.id)) {
                alumnos = this.sort(alumnos, parseInt(this.state.sort))
                const alumnosList = alumnos.map((alumno) => {
                    let color = "green"
                    if (Math.round(100*alumno.aciertos/this.state.num_preguntas) < 50) {
                        color = "red"
                    }
                    const user = this.state.players.find((player) => {
                        return player.id === alumno.userId
                    })
                    return(
                        <tr key={alumno.id} id="quizCell">
                            <div id="quizEntry">
                                <div style={{width: "90%", display: "flex"}}>
                                    <div style={{margin: "auto"}}><h4 style={{margin: "auto 0 auto 20px"}}>{alumno.position}º</h4></div>
                                    <div id="alumnoTitle1"><h5 style={{margin: "auto 0 auto 20px"}}>{alumno.username}</h5></div>
                                    <div id="alumnoTitle1"><h5 style={{margin: "auto auto auto 20px"}}>{user.email}</h5></div>
                                    <div id="alumnoTitle2">
                                        <h5 style={{margin: "auto 10px auto 20px"}}>Aciertos: {alumno.aciertos}/{this.state.num_preguntas}</h5>
                                        <h5 style={{margin: "auto auto auto 0", color: color}}>{Math.round(100*alumno.aciertos/this.state.num_preguntas)} %</h5>
                                    </div>
                                    <div  id="alumnoTitle3">
                                        <h5 style={{margin: "auto auto auto 20px"}}>Puntuación: {alumno.score}</h5>
                                    </div>
                                </div>
                                <div style={{margin: "auto auto", width: "10%", display: "flex", justifyContent: "end"}}>
                                    <button className="btn fas fa-trash-alt" id="deleteButton" onClick={(e) => this.delAlumno(alumno.id, e)}/>
                                </div>
                            </div>
                        </tr>
                    )
                });

                let fecha = ""
                if (this.props.game.game.createdAt !== undefined) {
                    let formatter = new Intl.DateTimeFormat("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric"
                    });
                    fecha = formatter.format(Date.parse(this.props.game.game.createdAt))
                }

                return(
                    <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                        <Navbar/>
                        <h1 style={{padding: "10px", textAlign: "center"}}>{this.props.game.game.quizName}</h1>
                        {alumnos.length === 0 ? <h4 style={{textAlign: "center", paddingBottom: "20px"}}>{fecha}</h4> : null}
                        {alumnos.length === 0 ? <h3 style={{textAlign: "center", padding: "30px"}}>No hay participantes</h3> :
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                                    <div style={{margin: "auto auto auto 5%"}}><h5 style={{backgroundColor: "#c8c8c8", borderRadius: "5px", padding: "5px", marginBottom: "0"}}>{fecha}</h5></div>
                                    <div style={{margin: "auto 5% auto auto"}}>
                                        <h7>Ordenar por: &nbsp;&nbsp;&nbsp;</h7>
                                        <select id="sortBy" onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                                            <option value="0">Puntuación</option>
                                            <option value="1">Aciertos</option>
                                            <option value="2">Nombre (a-z)</option>
                                            <option value="3">Nombre (z-a)</option>
                                        </select>
                                    </div>
                                </div>
                                <table style={{width: "95%", margin: "20px auto auto"}}>
                                    <tbody>
                                    {alumnosList}
                                    </tbody>
                                </table>
                            </div>
                        }
                        {/*} <ReactToExcel
                    className="btn btn-dark"
                    table="alumnos-table"
                    filename={this.props.game.game.quizName}
                    sheet="sheet 1"
                    buttonText="Download"
                />{*/}
                    </div>
                );
            } else {
                let alumno = alumnos.find(element => element.userId === this.props.login.user.id)
                let fecha = ""
                if (this.props.game.game.createdAt !== undefined) {
                    let formatter = new Intl.DateTimeFormat("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric"
                    });
                    fecha = formatter.format(Date.parse(this.props.game.game.createdAt))
                }
                let color = "green"
                if (Math.round(100*alumno.aciertos/this.state.num_preguntas) < 50) {
                    color = "red"
                }
                return(
                    <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                        <Navbar/>
                        <h1 style={{padding: "10px", textAlign: "center"}}>{this.props.game.game.quizName}</h1>
                        <div style={{margin: "10px auto 10px auto"}}><h4 style={{backgroundColor: "#c8c8c8", borderRadius: "5px", padding: "5px", marginBottom: "0"}}>{fecha}</h4></div>
                        <h2 style={{textAlign: "center", margin: "20px auto 10px auto"}}>{alumno.username}</h2>
                        <h3 style={{textAlign: "center", margin: "10px auto 10px auto"}}>Posición final: {alumno.position}º</h3>
                        <div style={{display: "inline-flex"}}>
                            <h5 style={{margin: "10px 0 10px auto"}}>Aciertos: {alumno.aciertos}/{this.state.num_preguntas} -&nbsp;</h5>
                            <h5 style={{margin: "10px auto auto 0", color: color}}>{Math.round(100*alumno.aciertos/this.state.num_preguntas)} %</h5>
                        </div>
                    </div>
                )
            }
        } else {
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <h1 style={{textAlign: "center", padding: "10px"}}>CARGANDO</h1>
                </div>
            )
        }
    }
}

ViewGame.propTypes = {
    getGame: PropTypes.func.isRequired,
    deleteAlumno: PropTypes.func.isRequired,
    getGameUsers: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    game: state.game,
    login: state.login
});

export default connect(mapStateToProps, {getGame, deleteAlumno, getGameUsers})(withRouter(ViewGame));