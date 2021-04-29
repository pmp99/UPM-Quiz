import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Navbar from "./Navbar";

class Main extends Component {
    constructor(props) {
        super(props);
        this.PIN = this.PIN.bind(this);
    }

    componentDidMount() {
        if (this.props.login.authenticated) {
            this.props.history.push('/user/' + this.props.login.user.id)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login.authenticated) {
            this.props.history.push('/user/' + this.props.login.user.id)
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
    login: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login
});

export default connect(mapStateToProps)(withRouter(Main));