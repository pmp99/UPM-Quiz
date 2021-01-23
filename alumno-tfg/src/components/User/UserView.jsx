import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import '../../styles/General.css'
import Navbar from "../Navbar";

class UserView extends React.Component {
    constructor(props){
        super(props);
        this.PIN = this.PIN.bind(this);
    }

    PIN(){
        this.props.history.push('/game')
    }

    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Navbar/>
                <button id="playButton" onClick={this.PIN}><h2>Jugar</h2></button>
            </div>
        );
    }
}


UserView.propTypes = {
    login: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    login: state.login,
    user: state.user
});

export default connect(mapStateToProps)(withRouter(UserView));