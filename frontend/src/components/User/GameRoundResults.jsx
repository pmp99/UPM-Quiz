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
        let alumnos = this.state.game.players
        if(alumnos !== undefined){
            alumnos.sort((a, b) => {return a.position-b.position})
            let n = alumnos.length
            alumnos = n >= 5 ? alumnos.slice(0, 5) : alumnos.slice(0, n)

            const results = alumnos.map((alumno) => {
                return(
                    <div id="scoreEntry" key={alumno.id}>
                        <div style={{width: "90%", display: "flex", justifyContent: "start"}}>
                            <h4 style={{margin: "auto 0 auto 30px"}}>{alumno.position}º</h4>
                            <h5 style={{margin: "auto auto auto 30px"}}>{alumno.username}</h5>
                        </div>
                        <div style={{margin: "auto auto", width: "10%", display: "flex", justifyContent: "end"}}>
                            <h5 style={{margin: "auto 30px auto auto"}}>{alumno.score}</h5>
                        </div>
                    </div>
                )
            });

            return(
                <div style={{display: "flex", flexDirection: "column", justifyContent: "start", height: "100vh", width: "100vw", backgroundColor: "#003464"}}>
                    <nav style={{backgroundColor: "white", borderBottom: "2px solid black"}}>
                        <h1 style={{textAlign: "center", padding: "10px"}}>Marcador</h1>
                    </nav>
                    <div style={{width: "95%", margin: "20px auto"}}>
                        {results}
                    </div>
                    <div style={{padding: "30px", width: "100%", display: "flex", justifyContent: "center"}}><button id="nextQuestionButton" onClick={this.props.nextQuestion}>Siguiente pregunta</button></div>
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