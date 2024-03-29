import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Button from '@material-ui/core/Button';
import {deletePlayer, getGame, getGamePlayersUser} from '../../redux/actions/game_actions'
import Navbar from "../Navbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class ViewGame extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            game: null,
            sort: 0,
            playersUser: null
        }
        this.delPlayer = this.delPlayer.bind(this)
    }

    componentDidMount(){
        if (this.props.game.game.id === undefined || this.props.game.game.id !== parseInt(this.props.match.params.gameID) ||
            (this.props.game.game.quiz.userId !== this.props.login.user.id && !this.props.game.game.players.some((player => player.userId === this.props.login.user.id)) && !this.props.login.user.isAdmin)) {
            this.props.history.push('/user/'+this.props.login.user.id+'/games')
        } else {
            this.props.getGamePlayersUser(this.props.game.game.id)
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            game: nextProps.game.game,
            playersUser: this.props.game.playersUser
        })
    }

    delPlayer(playerId,e){
        this.props.deletePlayer(playerId);
    }

    sort(alumnos, type) {
        switch (type) {
            case 0:
                alumnos.sort((a, b) => {return a.position-b.position})
                return(alumnos)
            case 1:
                alumnos.sort((a, b) => {return b.rightAnswers-a.rightAnswers})
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

    exportToExcel() {
        const fecha = new Date(Date.parse(this.state.game.createdAt))
        const hours = fecha.getHours().toString().length === 1 ? '0'+fecha.getHours() : fecha.getHours()
        const minutes = fecha.getMinutes().toString().length === 1 ? '0'+fecha.getMinutes() : fecha.getMinutes()
        const fileName = "Resultados_" + this.state.game.quiz.name + "_" + fecha.getDate() + "-" + (fecha.getMonth()+1) + "-" + fecha.getFullYear() + "-" + hours + "-" + minutes
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        const fileExtension = ".xlsx"
        const players = this.sort(this.state.game.players, 0)
        const playersFormatted = players.map((player) => {
            return {"Puesto": player.position,
                "Nickname": player.username,
                "Nombre": player.user !== null ? player.user.name : "",
                "Correo": player.user !== null ? player.user.email : "",
                "Aciertos": player.rightAnswers,
                "Porcentaje": Math.round(100*player.rightAnswers/this.state.game.nQuestions),
                "Puntuacion": player.score
            }
        })
        let wb = XLSX.utils.book_new()
        wb.Props = {
            Title: "Informe de resultados",
            Subject: "",
            Author: "UPM Quiz",
            CreatedDate: new Date()
        }

        wb.SheetNames.push("Resultados")
        wb.Sheets["Resultados"] = XLSX.utils.json_to_sheet(playersFormatted)
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
        const data = new Blob([excelBuffer], { type: fileType })
        FileSaver.saveAs(data, fileName + fileExtension)
    }

    render() {
        let game = this.state.game
        if (game !== null && this.state.playersUser !== null) {
            if (this.props.login.user.id === game.quiz.userId || (this.props.login.user.isAdmin && parseInt(this.props.match.params.userID) !== this.props.login.user.id)) {
                const players = this.sort(game.players, parseInt(this.state.sort))
                const playersList = players.map((player) => {
                    let color = Math.round(100*player.rightAnswers/game.nQuestions) < 50 ? "red" : "green"
                    const user = player.user
                    return(
                        <div className="quizEntry" key={player.id}>
                            <div style={{width: "90%", display: "flex"}}>
                                <div style={{margin: "auto"}}><h4 style={{margin: "auto 0 auto 20px"}}>{player.position}º</h4></div>
                                <div id="alumnoTitle1"><h5 style={{margin: "auto 0 auto 20px"}}>{player.username}</h5></div>
                                <div id="alumnoTitle1"><h5 style={{margin: "auto auto auto 20px"}}>{user === null ? null : user.email}</h5></div>
                                <div id="alumnoTitle2">
                                    <h5 style={{margin: "auto 10px auto 20px"}}>Aciertos: {player.rightAnswers}/{game.nQuestions}</h5>
                                    <h5 style={{margin: "auto auto auto 0", color: color}}>{Math.round(100*player.rightAnswers/game.nQuestions)} %</h5>
                                </div>
                                <div  id="alumnoTitle3">
                                    <h5 style={{margin: "auto auto auto 20px"}}>Puntuación: {player.score}</h5>
                                </div>
                            </div>
                            <div style={{margin: "auto auto", width: "10%", display: "flex", justifyContent: "end"}}>
                                <button className="btn fas fa-trash-alt" id="deleteButton" onClick={(e) => this.delPlayer(player.id, e)}/>
                            </div>
                        </div>
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
                    fecha = formatter.format(Date.parse(game.createdAt))
                }

                return(
                    <div style={{minHeight: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                        <Navbar/>
                        <h1 id="header">{game.quiz.name}</h1>
                        {players.length === 0 ? <h4 style={{textAlign: "center", padding: "20px"}}>{fecha}</h4> : null}
                        {players.length === 0 ? <h3 style={{textAlign: "center", padding: "30px"}}>No hay participantes</h3> :
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                                    <div style={{display: 'flex', margin: "auto auto auto 5%"}}>
                                        <h5 style={{backgroundColor: "#c8c8c8", borderRadius: "5px", padding: "5px", marginBottom: "0"}}>{fecha}</h5>
                                        <Button onClick={this.exportToExcel.bind(this)} color="primary" variant="contained" style={{marginLeft: '50px'}}>Descargar</Button>
                                    </div>
                                    <div style={{margin: "auto 5% auto auto"}}>
                                        Ordenar por: &nbsp;&nbsp;&nbsp;
                                        <select id="sortBy" onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                                            <option value="0">Puntuación</option>
                                            <option value="1">Aciertos</option>
                                            <option value="2">Nombre (a-z)</option>
                                            <option value="3">Nombre (z-a)</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{width: "95%", margin: "20px auto"}}>
                                    {playersList}
                                </div>
                            </div>
                        }
                    </div>
                );
            } else {
                let player = game.players.find(element => element.userId === this.props.login.user.id)
                let fecha = ""
                if (this.props.game.game.createdAt !== undefined) {
                    let formatter = new Intl.DateTimeFormat("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric"
                    });
                    fecha = formatter.format(Date.parse(game.createdAt))
                }
                let color = Math.round(100*player.rightAnswers/game.nQuestions) < 50 ? "red" : "green"
                return(
                    <div style={{minHeight: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                        <Navbar/>
                        <h1 id="header">{game.quiz.name}</h1>
                        <div style={{margin: "10px auto 10px auto"}}><h4 style={{backgroundColor: "#c8c8c8", borderRadius: "5px", padding: "5px", marginBottom: "0"}}>{fecha}</h4></div>
                        <h2 style={{textAlign: "center", margin: "20px auto 10px auto"}}>{player.username}</h2>
                        <h3 style={{textAlign: "center", margin: "10px auto 10px auto"}}>Posición final: {player.position}º</h3>
                        <div style={{display: "inline-flex"}}>
                            <h5 style={{margin: "10px 0 10px auto"}}>Aciertos: {player.rightAnswers}/{game.nQuestions} -&nbsp;</h5>
                            <h5 style={{margin: "10px auto auto 0", color: color}}>{Math.round(100*player.rightAnswers/game.nQuestions)} %</h5>
                        </div>
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

ViewGame.propTypes = {
    getGame: PropTypes.func.isRequired,
    deletePlayer: PropTypes.func.isRequired,
    getGamePlayersUser: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    game: state.game,
    login: state.login
});

export default connect(mapStateToProps, {getGame, deletePlayer, getGamePlayersUser})(withRouter(ViewGame));