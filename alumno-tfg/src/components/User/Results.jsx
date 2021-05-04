import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getGame} from '../../redux/actions/game_actions'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class Results extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            game: {}
        }
    }

    componentDidMount(){
        const gameId = this.props.gameId
        this.props.getGame(gameId)
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            game: nextProps.game.game
        })
    }


    render() {
        const alumnos = this.state.game.players
        if(alumnos !== undefined){
            let n = this.state.game.quiz.questions.length
            alumnos.sort((a, b) => {return a.position-b.position})
            let alumnoVacio = {username: "", score: "", rightAnswers: ""}
            let l = alumnos.length
            if (l < 3) {
                for (let i = 0; i < 3-l; i++) {
                    alumnos.push(alumnoVacio)
                }
            }
            return(
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", width: "100vw", backgroundColor: "#421886"}}>
                    <nav style={{backgroundColor: "white", borderBottom: "2px solid black"}}>
                        <h1 style={{textAlign: "center", padding: "10px"}}>Podio</h1>
                    </nav>
                    <div style={{margin: "auto auto"}}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "flex-end"}}>
                            <div className="podium"><div id="textPodium">{alumnos[1].username || ""}</div>
                                {l < 2 ? <div id="podium1"/> : <div id="podium1"><b>{alumnos[1].score}</b> puntos<br/>{alumnos[1].rightAnswers} de {n}</div>}
                            </div>
                            <div className="podium"><div id="textPodium">{alumnos[0].username || ""}</div>
                                <div id="podium0"><b>{alumnos[0].score}</b> puntos<br/>{alumnos[0].rightAnswers} de {n}</div></div>
                            <div className="podium"><div id="textPodium">{alumnos[2].username || ""}</div>
                                {l < 3 ? <div id="podium2"/> : <div id="podium2"><b>{alumnos[2].score}</b> puntos<br/>{alumnos[2].rightAnswers} de {n}</div>}
                            </div>
                        </div>
                    </div>
                    <div style={{padding: "30px", width: "100%", display: "flex", justifyContent: "center"}}><button id="endGameButton" onClick={this.props.end}>Terminar</button></div>
                </div>
            )
        }
        else{
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Backdrop style={{color: "black", zIndex: "1"}} open={true}>
                        <CircularProgress style={{color: "white"}} size={80} />
                    </Backdrop>
                </div>
            );
        }  
    }
}


Results.propTypes = {
    getGame: PropTypes.func.isRequired,
    game: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    game: state.game
});

export default connect(mapStateToProps, {getGame})(withRouter(Results));