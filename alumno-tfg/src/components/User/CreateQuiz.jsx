import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {createQuiz} from '../../actions/quiz_actions'
import Navbar from "../Navbar";

class CreateQuiz extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            owner: ""
        }
        this.createQuiz = this.createQuiz.bind(this)
    }

    componentDidMount(){
        this.setState({
            owner: this.props.login.user.id
        })
    }

    createQuiz(e){
        e.preventDefault();
        const quizName = this.state.name;
        const owner = this.state.owner;
        this.props.createQuiz(quizName, owner, this.props)
    }

    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Navbar/>
                <div><h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Crear kahoot</h1></div>
                <div style={{marginTop: "100px"}}>
                    <form id="inputForm" onSubmit={this.createQuiz}>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Nombre del kahoot</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({name: e.target.value})} required/>
                        </div>
                        <div>
                            {this.state.name === "" ?
                                <input type="submit" value="Crear" id="loginButtonDisabled"/> :
                                <input type="submit" value="Crear" id="loginButton"/>}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

CreateQuiz.propTypes = {
    createQuiz: PropTypes.func.isRequired,
    quiz: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    quiz: state.quiz,
    login: state.login
});

export default connect(mapStateToProps, {createQuiz})(withRouter(CreateQuiz));