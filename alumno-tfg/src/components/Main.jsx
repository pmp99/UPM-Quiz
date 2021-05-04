import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {checkPlaying} from '../redux/actions/game_actions'
import {setNickname} from '../redux/actions/play_actions'
import Navbar from "./Navbar";

class Main extends Component {
    constructor(props) {
        super(props);
        this.PIN = this.PIN.bind(this);
    }

    componentDidMount() {
        if (this.props.login.authenticated) {
            this.props.history.push('/user/' + this.props.login.user.id)
        } else {
            if (localStorage.nickname !== null && localStorage.nickname !== "" && localStorage.nickname !== undefined && localStorage.nickname !== "undefined") {
                const nickname = localStorage.nickname
                this.props.checkPlaying(null, nickname)
            }
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.login.authenticated) {
            this.props.history.push('/user/' + this.props.login.user.id)
        } else {
            if (nextProps.game.game.status !== undefined && nextProps.game.game.status !== 0 && localStorage.nickname !== "" && localStorage.nickname !== null && localStorage.nickname !== undefined && localStorage.nickname !== "undefined") {
                if (nextProps.play.user === "") {
                    this.props.setNickname(localStorage.nickname)
                } else {
                    localStorage.removeItem('nickname')
                    this.props.history.push('/game/'+nextProps.game.game.id)
                }
            }
        }
    }


    PIN(){
        this.props.history.push('/game')
    }


    render() {
        let colors = ["#79de4f", "#46b4a0", "#e5cc3c", "#f18d5f"]
        let r = Math.floor(Math.random()*4)
        return (
            <div style={{height: "100vh", backgroundColor: colors[r], display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <Navbar/>
                <button id="playButton" onClick={this.PIN}><h2>Jugar</h2></button>
            </div>
        )
    }
}

Main.propTypes = {
    checkPlaying: PropTypes.func.isRequired,
    setNickname: PropTypes.func.isRequired,
    login: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    play: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    game: state.game,
    play: state.play
});

export default connect(mapStateToProps, {setNickname, checkPlaying})(withRouter(Main));