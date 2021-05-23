import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {checkPlaying} from '../redux/actions/game_actions'
import {setNickname, changeBackgroundColor} from '../redux/actions/play_actions'
import Navbar from "./Navbar";

class Main extends Component {
    constructor(props) {
        super(props);
        this.PIN = this.PIN.bind(this)
        this.changeBackgroundColor = this.changeBackgroundColor.bind(this)
        this.timerBackgroundColor = setInterval(this.changeBackgroundColor, 100)
    }

    componentDidMount() {
        if (this.props.login.authenticated) {
            this.props.history.push('/user/' + this.props.login.user.id)
        } else {
            if (localStorage.gameInfo !== null && localStorage.gameInfo !== "" && localStorage.gameInfo !== undefined && localStorage.gameInfo !== "undefined") {
                const gameInfo = JSON.parse(localStorage.gameInfo)
                const name = gameInfo.name
                const gameId = gameInfo.gameId
                this.props.checkPlaying(null, name, gameId)
            }
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.login.authenticated) {
            this.props.history.push('/user/' + this.props.login.user.id)
        } else {
            if (nextProps.game.game.status !== undefined && nextProps.game.game.status !== 0 && localStorage.gameInfo !== "" && localStorage.gameInfo !== null && localStorage.gameInfo !== undefined && localStorage.gameInfo !== "undefined") {
                if (nextProps.play.user === "") {
                    const gameInfo = JSON.parse(localStorage.gameInfo)
                    this.props.setNickname(gameInfo.name)
                } else {
                    localStorage.removeItem('gameInfo')
                    this.props.history.push('/game/'+nextProps.game.game.id)
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
        return (
            <div style={{height: "100vh", backgroundColor: '#'+this.props.play.backgroundColor.color, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Navbar/>
                <button id="playButton" onClick={this.PIN}><h2>Jugar</h2></button>
            </div>
        )
    }
}

Main.propTypes = {
    checkPlaying: PropTypes.func.isRequired,
    setNickname: PropTypes.func.isRequired,
    changeBackgroundColor: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    play: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    game: state.game,
    play: state.play
});

export default connect(mapStateToProps, {setNickname, checkPlaying, changeBackgroundColor})(withRouter(Main));