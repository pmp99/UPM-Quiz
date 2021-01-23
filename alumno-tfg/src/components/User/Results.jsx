import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getGame} from '../../actions/game_actions'

class Results extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            game: {},
            quiz: {}
        }
    }

    componentDidMount(){
        const gameId = this.props.gameId
        const quizId = this.props.quizId
        this.props.getGame(gameId, quizId)
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            game: nextProps.game.game,
            quiz: nextProps.game.quiz
        })
    }


    render() {
        const alumnos = this.state.game.alumnos
        if(alumnos !== undefined){
            let n = this.state.quiz.pregunta.length
            alumnos.sort((a, b) => {return a.position-b.position})
            let alumnoVacio = {username: "", score: "", aciertos: ""}
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
                    <table className="table" style={{margin: "auto auto"}}>
                        <tbody>
                        <tr style={{border: "none"}}>
                            <td style={{border: "none"}} className="podium-td"><div id="textPodium">{alumnos[1].username || ""}</div>
                                {l < 2 ? <div id="podium1"/> : <div id="podium1"><b>{alumnos[1].score}</b> puntos<br/>{alumnos[1].aciertos} de {n}</div>}
                            </td>
                            <td style={{border: "none"}} className="podium-td"><div id="textPodium">{alumnos[0].username || ""}</div>
                                <div id="podium0"><b>{alumnos[0].score}</b> puntos<br/>{alumnos[0].aciertos} de {n}</div></td>
                            <td style={{border: "none"}} className="podium-td"><div id="textPodium">{alumnos[2].username || ""}</div>
                                {l < 3 ? <div id="podium2"/> : <div id="podium2"><b>{alumnos[2].score}</b> puntos<br/>{alumnos[2].aciertos} de {n}</div>}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div style={{padding: "30px", width: "100%", display: "flex", justifyContent: "center"}}><button id="endGameButton" onClick={this.props.end}>Terminar</button></div>
                </div>
            )
        }
        else{
            return(
                <div style={{height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <h1 style={{textAlign: "center", padding: "10px"}}>CARGANDO</h1>
                </div>
            );
        }  
    }
}


Results.propTypes = {
    getGame: PropTypes.func.isRequired,
    quiz: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    quiz: state.quiz,
    game: state.game
});

export default connect(mapStateToProps, {getGame})(withRouter(Results));