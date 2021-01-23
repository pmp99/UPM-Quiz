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
        let alumnos = this.state.game.alumnos
        if(alumnos !== undefined){
            alumnos.sort((a, b) => {return a.position-b.position})
            let n = alumnos.length
            if (n >= 5) {
                alumnos = alumnos.slice(0, 5)
            } else {
                alumnos = alumnos.slice(0, n)
            }

            const results = alumnos.map((alumno) => {
                return(
                    <tr key={alumno.id} id="quizCell">
                        <div id="scoreEntry">
                            <div style={{width: "90%", display: "flex", justifyContent: "start"}}>
                                <h4 style={{margin: "auto 0 auto 30px"}}>{alumno.position}º</h4>
                                <h5 style={{margin: "auto auto auto 30px"}}>{alumno.username}</h5>
                            </div>
                            <div style={{margin: "auto auto", width: "10%", display: "flex", justifyContent: "end"}}>
                                <h5 style={{margin: "auto 30px auto auto"}}>{alumno.score}</h5>
                            </div>
                        </div>
                    </tr>
                )
            });

            return(
                <div style={{display: "flex", flexDirection: "column", justifyContent: "start", height: "100vh", width: "100vw", backgroundColor: "#421886"}}>
                    <nav style={{backgroundColor: "white", borderBottom: "2px solid black"}}>
                        <h1 style={{textAlign: "center", padding: "10px"}}>Marcador</h1>
                    </nav>
                    <table style={{width: "95%", margin: "20px auto auto"}}>
                        <tbody>
                        {results}
                        </tbody>
                    </table>
                    <div style={{padding: "30px", width: "100%", display: "flex", justifyContent: "center"}}><button id="nextQuestionButton" onClick={this.props.nextQuestion}>Siguiente pregunta</button></div>
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