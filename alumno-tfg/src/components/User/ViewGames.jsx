import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getGamesFromUser, getGamesPlayed, getGamesRemoved, addGamesRemoved} from '../../actions/game_actions'
import Navbar from "../Navbar";

class ViewGames extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            games: [],
            gamesPlayed: [],
            gamesRemoved: [],
            sort: 0,
            presented: 0
        }
        this.deleteGame = this.deleteGame.bind(this);
    }

    componentDidMount(){
        const id = this.props.match.params.userID;
        this.props.getGamesFromUser(id);
        this.props.getGamesPlayed(id);
        this.props.getGamesRemoved(id);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            games: nextProps.game.games,
            gamesPlayed: nextProps.game.gamesPlayed,
            gamesRemoved: nextProps.game.gamesRemoved.map((element) => {
                return element.gameId
            })
        })
    }

    deleteGame(id, e){
        const userId = this.props.match.params.userID;
        this.props.addGamesRemoved(userId, id);
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

    sort(games, type) {
        switch (type) {
            case 0:
                games.sort((a, b) => {return Date.parse(b.createdAt) - Date.parse(a.createdAt)})
                return(games)
            case 1:
                games.sort((a, b) => {return Date.parse(a.createdAt) - Date.parse(b.createdAt)})
                return(games)
            case 2:
                games.sort((a, b) => {return b.alumnos.length-a.alumnos.length})
                return(games)
            case 3:
                games.sort((a, b) => {return a.quizName.toLowerCase().localeCompare(b.quizName.toLowerCase())})
                return(games)
            case 4:
                games.sort((a, b) => {return b.quizName.toLowerCase().localeCompare(a.quizName.toLowerCase())})
                return(games)
            default:
                return(games)
        }
    }

    render() {
        let myGames = this.state.games
        let gamesPlayed = this.state.gamesPlayed
        let gamesRemoved = this.state.gamesRemoved
        if (myGames !== undefined && gamesPlayed !== undefined) {
            myGames = myGames.filter((game) => {return !gamesRemoved.includes(game.id)})
            gamesPlayed = gamesPlayed.filter((game) => {return !gamesRemoved.includes(game.id)})
            let games = []
            if (parseInt(this.state.presented) === 0) {
                games = myGames.concat(gamesPlayed)
            } else if (parseInt(this.state.presented) === 1) {
                games = myGames
            } else {
                games = gamesPlayed
            }
            games = this.sort(games, parseInt(this.state.sort))
            const gameList = games.map((game) => {
                //Cantor pairing function
                const w = game.id+game.quizId
                const gameQuizId = game.quizId + (w*(w+1))/2
                let viewLink = '/user/'+this.props.match.params.userID+'/games/'+gameQuizId
                if (this.props.login.user.isAdmin && this.props.match.params.userID == this.props.login.user.id) {
                    viewLink = '/admin/'+this.props.match.params.userID+'/games/'+gameQuizId
                }
                let formatterDate = new Intl.DateTimeFormat("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric"
                });
                const fecha = formatterDate.format(Date.parse(game.createdAt))
                let autor = game.user.name
                if (this.props.login.user.id === game.user.id) {
                    autor = "mí"
                }
                let width = 130+8.9*autor.length+'px'
                return(
                    <tr key={game.id} id="quizCell">
                        <div id="quizEntry">
                            <Link to={viewLink} id="quizEntryLink"><h5 id="quizTitle">{game.quizName}</h5></Link>
                            <div style={{margin: "auto auto", textAlign: "center", display: "flex", flexDirection: "row"}}>
                                <div style={{margin: "auto 10px auto auto", width: width}}><h6 style={{margin: "auto auto"}}>Presentado por: {autor}</h6></div>
                                <div style={{color: "#464646", fontSize: "18px", margin: "auto 10px", backgroundColor: "#f0f0f0", borderRadius: "10px", padding: "6px", width: "180px"}}>{fecha}</div>
                                <div style={{margin: "auto 10px", width: "120px"}}><h6 style={{margin: "auto auto"}}>Jugadores: {game.alumnos.length}</h6></div>
                            </div>
                            <button className="btn fas fa-trash-alt" id="deleteButton" onClick={(e) => this.deleteGame(game.id, e)}/>
                        </div>
                    </tr>
                )
            });

            let quizzesLink = "/user/"+this.props.login.user.id+"/quizzes"
            if (this.props.login.user.isAdmin) {
                quizzesLink = "/admin/"+this.props.login.user.id+"/quizzes"
            }
            const playLink = "/game"
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Navbar/>
                    <h1 style={{textAlign: "center", padding: "10px"}}>Juegos</h1>
                    {myGames.length === 0 && gamesPlayed.length === 0 ?
                        <div style={{textAlign: "center"}}>
                            <h3 style={{textAlign: "center", padding: "30px"}}>No hay juegos</h3>
                            {this.props.login.user.id == this.props.match.params.userID ? <h5>Pulsa <Link to={quizzesLink}>aquí</Link> para ver tus kahoots y empezar uno como anfitrión
                            o <br/> pulsa <Link to={playLink}>aquí</Link> para jugar introduciendo un PIN</h5> : null}
                        </div> :
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                                <div style={{margin: "auto auto auto 5%"}}>
                                    <h7>Presentado por: &nbsp;&nbsp;&nbsp;</h7>
                                    <select id="sortBy" onChange={(e) => this.setState({presented: e.target.value})} value={this.state.presented}>
                                        <option value="0">Cualquiera</option>
                                        <option value="1">Mí</option>
                                        <option value="2">Otros</option>
                                    </select>
                                </div>
                                <div style={{margin: "auto 5% auto auto"}}>
                                    <h7>Ordenar por: &nbsp;&nbsp;&nbsp;</h7>
                                    <select id="sortBy" onChange={(e) => this.setState({sort: e.target.value})} value={this.state.sort}>
                                        <option value="0">Más reciente</option>
                                        <option value="1">Más antiguo</option>
                                        <option value="2">Nº jugadores</option>
                                        <option value="3">Nombre (a-z)</option>
                                        <option value="4">Nombre (z-a)</option>
                                    </select>
                                </div>
                            </div>
                            {parseInt(this.state.presented) === 1 && myGames.length === 0 ?
                                <h4 style={{textAlign: "center", padding: "30px"}}>No hay juegos presentados por mí</h4> :
                                parseInt(this.state.presented) === 2 && gamesPlayed.length === 0 ?
                                    <h4 style={{textAlign: "center", padding: "30px"}}>No hay juegos presentados por otros</h4> :
                                    <table style={{width: "95%", margin: "20px auto auto"}}>
                                        <tbody>
                                        {gameList}
                                        </tbody>
                                    </table>
                            }
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


ViewGames.propTypes = {
    getGamesFromUser: PropTypes.func.isRequired,
    getGamesPlayed: PropTypes.func.isRequired,
    getGamesRemoved: PropTypes.func.isRequired,
    addGamesRemoved: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    login: state.login,
    game: state.game
});

export default connect(mapStateToProps, {getGamesFromUser, getGamesPlayed, getGamesRemoved, addGamesRemoved})(withRouter(ViewGames));