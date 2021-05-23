import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {checkPlaying} from '../../redux/actions/game_actions'
import {setNickname, changeBackgroundColor} from '../../redux/actions/play_actions'
import '../../styles/General.css'
import Navbar from "../Navbar";

class UserView extends React.Component {
    constructor(props){
        super(props);
        this.PIN = this.PIN.bind(this)
        this.changeBackgroundColor = this.changeBackgroundColor.bind(this)
        this.timerBackgroundColor = setInterval(this.changeBackgroundColor, 100)
    }

    componentDidMount() {
        this.props.checkPlaying(this.props.login.user.id, null, null)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.game.game.status !== undefined && nextProps.game.game.status !== 0) {
            if (this.props.login.user.id === nextProps.game.game.quiz.userId) {
                if (nextProps.game.game.status === 1) {
                    this.props.history.push('/user/'+this.props.login.user.id+'/quizzes/'+nextProps.game.game.quiz.id+'/play')
                } else {
                    this.props.history.push('/user/'+this.props.login.user.id+'/quizzes/'+nextProps.game.game.quiz.id+'/playing')
                }
            } else {
                if (!(nextProps.game.game.status === 3 && nextProps.game.game.currentQuestion >= nextProps.game.game.quiz.questions.length - 1)) {
                    if (nextProps.play.user === "") {
                        const players = nextProps.game.game.players
                        const player = players.find((player) => player.user.id === this.props.login.user.id)
                        this.props.setNickname(player.username)
                    } else {
                        this.props.history.push('/game/'+nextProps.game.game.id)
                    }
                }
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerBackgroundColor)
    }

    changeBackgroundColor(){
        let time = this.props.play.backgroundColor.time
        const interval = 1/600
        time = Math.abs(time+interval - 1) < interval/10 ? 0 : time+interval
        this.props.changeBackgroundColor(time)
    }

    PIN(){
        this.props.history.push('/game')
    }

    render() {
        return(
            <div style={{minHeight: "100vh", backgroundColor: '#'+this.props.play.backgroundColor.color, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Navbar/>
                <button id="playButton" onClick={this.PIN}><h2>Jugar</h2></button>
            </div>
        );
    }
}


UserView.propTypes = {
    checkPlaying: PropTypes.func.isRequired,
    setNickname: PropTypes.func.isRequired,
    changeBackgroundColor: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    play: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    user: state.user,
    game: state.game,
    play: state.play
});

export default connect(mapStateToProps, {checkPlaying, setNickname, changeBackgroundColor})(withRouter(UserView));