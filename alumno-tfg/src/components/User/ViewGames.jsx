import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getGames, getGamesPlayed, getGamesRemoved, addGamesRemoved, setGame} from '../../redux/actions/game_actions'
import Navbar from "../Navbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class ViewGames extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            games: null,
            gamesPlayed: null,
            gamesRemoved: null,
            sort: 0,
            presented: 0
        }
        this.deleteGame = this.deleteGame.bind(this);
    }

    componentDidMount(){
        const userId = this.props.match.params.userID;
        this.props.getGames(userId);
        this.props.getGamesPlayed(userId);
        this.props.getGamesRemoved(userId);
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

    sort(games, type) {
        switch (type) {
            case 0:
                games.sort((a, b) => {return Date.parse(b.createdAt) - Date.parse(a.createdAt)})
                return(games)
            case 1:
                games.sort((a, b) => {return Date.parse(a.createdAt) - Date.parse(b.createdAt)})
                return(games)
            case 2:
                games.sort((a, b) => {return b.players.length-a.players.length})
                return(games)
            case 3:
                games.sort((a, b) => {return a.quiz.name.toLowerCase().localeCompare(b.quiz.name.toLowerCase())})
                return(games)
            case 4:
                games.sort((a, b) => {return b.quiz.name.toLowerCase().localeCompare(a.quiz.name.toLowerCase())})
                return(games)
            default:
                return(games)
        }
    }

    render() {
        let myGames = this.state.games
        let gamesPlayed = this.state.gamesPlayed
        let gamesRemoved = this.state.gamesRemoved
        if (myGames !== null && gamesPlayed !== null && gamesRemoved !== null) {
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
            const longestAutor = Math.max(...games.map((game) => {
                if (this.props.login.user.id === game.quiz.user.id) {
                    return 2
                } else {
                    return game.quiz.user.name.length
                }
            }))
            const gameList = games.map((game) => {
                const viewLink = '/user/'+this.props.match.params.userID+'/games/'+game.id
                let formatterDate = new Intl.DateTimeFormat("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric"
                });
                const fecha = formatterDate.format(Date.parse(game.createdAt))
                let autor = game.quiz.user.name
                if (this.props.login.user.id === game.quiz.user.id) {
                    autor = "mí"
                }
                let width = 130+8.9*longestAutor+'px'
                return(
                    <td key={game.id} className="quizCell">
                        <div id="quizEntry">
                            <Link to={viewLink} onClick={() => this.props.setGame(game)} id="quizEntryLink"><h5 id="quizTitle">{game.quiz.name}</h5></Link>
                            <div style={{margin: "auto auto", textAlign: "center", display: "flex", flexDirection: "row"}}>
                                <div style={{margin: "auto 10px auto auto", width: width}}><h6 style={{margin: "auto auto", textAlign: 'left'}}>Presentado por: {autor}</h6></div>
                                <div style={{color: "#464646", fontSize: "18px", margin: "auto 10px", backgroundColor: "#f0f0f0", borderRadius: "10px", padding: "6px", width: "180px"}}>{fecha}</div>
                                <div style={{margin: "auto 10px", width: "120px"}}><h6 style={{margin: "auto auto"}}>Jugadores: {game.players.length}</h6></div>
                            </div>
                            <button className="btn fas fa-trash-alt" id="deleteButton" onClick={(e) => this.deleteGame(game.id, e)}/>
                        </div>
                    </td>
                )
            });

            const quizzesLink = "/user/"+this.props.login.user.id+"/quizzes"
            const playLink = "/game"
            return(
                <div style={{minHeight: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Navbar/>
                    <h1 id="header">Juegos</h1>
                    {myGames.length === 0 && gamesPlayed.length === 0 ?
                        <div style={{textAlign: "center"}}>
                            <h3 style={{textAlign: "center", padding: "30px"}}>No hay juegos</h3>
                            {this.props.login.user.id === parseInt(this.props.match.params.userID) ? <h5>Pulsa <Link to={quizzesLink}>aquí</Link> para ver tus kahoots y empezar uno como anfitrión
                            o <br/> pulsa <Link to={playLink}>aquí</Link> para jugar introduciendo un PIN</h5> : null}
                        </div> :
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{display: "inline-flex", margin: "auto 4% auto auto", width: "100%"}}>
                                <div style={{margin: "auto auto auto 5%"}}>
                                    Presentado por: &nbsp;&nbsp;&nbsp;
                                    <select id="sortBy" onChange={(e) => this.setState({presented: e.target.value})} value={this.state.presented}>
                                        <option value="0">Cualquiera</option>
                                        <option value="1">Mí</option>
                                        <option value="2">Otros</option>
                                    </select>
                                </div>
                                <div style={{margin: "auto 5% auto auto"}}>
                                    Ordenar por: &nbsp;&nbsp;&nbsp;
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
                    <Backdrop style={{color: "black", zIndex: "1"}} open={true}>
                        <CircularProgress style={{color: "white"}} size={80} />
                    </Backdrop>
                </div>
            )
        }

    }
}


ViewGames.propTypes = {
    setGame: PropTypes.func.isRequired,
    getGames: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, {getGames, getGamesPlayed, getGamesRemoved, addGamesRemoved, setGame})(withRouter(ViewGames));