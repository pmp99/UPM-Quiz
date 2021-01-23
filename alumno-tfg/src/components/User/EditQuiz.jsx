import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getQuiz, editQuiz} from '../../actions/quiz_actions';
import Navbar from "../Navbar";

class EditQuiz extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: ""
        }
        this.edit = this.edit.bind(this);
    }

    componentDidMount(){
        const quizId = this.props.match.params.quizID;
        this.props.getQuiz(quizId)
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            name: nextProps.quiz.quiz.name
        })
    }

    edit(e){
        e.preventDefault();
        const id = this.props.match.params.quizID;
        const name = this.state.name
        this.props.editQuiz(id, name, this.props)
    }


    render() {
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "start"}}>
                    <Navbar/>
                    <div><h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Editar kahoot</h1></div>
                    <div style={{marginTop: "100px"}}>
                        <form id="inputForm" onSubmit={this.edit}>
                            <div style={{paddingBottom: "20px"}}>
                                <label style={{fontWeight: "bold"}}>Nombre del kahoot</label>
                                <input type="text" className="form-control" onChange={(e) => this.setState({name: e.target.value})} value={this.state.name} required/>
                            </div>
                            <div>
                                {this.state.name === "" ?
                                    <input type="submit" value="Guardar cambios" id="loginButtonDisabled"/> :
                                    <input type="submit" value="Guardar cambios" id="loginButton"/>}
                            </div>
                        </form>
                    </div>
                </div>
            );
    }
}


EditQuiz.propTypes = {
    getQuiz: PropTypes.func.isRequired,
    editQuiz: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    quiz: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    quiz: state.quiz,
    login: state.login
});

export default connect(mapStateToProps, {getQuiz, editQuiz})(withRouter(EditQuiz));