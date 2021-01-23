import React from 'react';
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {newQuestion} from '../../actions/question_actions';
import '../../styles/General.css'
import Navbar from "../Navbar";
import empty from '../../assets/empty.jpg'

class AddQuestion extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            question: "",
            answer0: "",
            answer1: "",
            answer2: "",
            answer3: "",
            correct: 0,
            time: 5,
            imageSrc: ""
        }
        this.addQuestion = this.addQuestion.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    addQuestion(e){
        e.preventDefault();
        const question = this.state
        this.props.newQuestion(this.props.quiz.quiz.id, question, this.props)
    }

    onDrop(e){
        e.preventDefault();
        this.onFileChange(e, e.dataTransfer.files[0]);
    }

    onFileChange(e, file){
        var file = file || e.target.files[0],
            pattern = /image-*/,
            reader = new FileReader();
             
        if (!file.type.match(pattern)) {
            alert('Formato inválido');
            return;
        }
         
        reader.onload = (e) => {
            this.setState({ 
                imageSrc: reader.result
            }); 
        }
        reader.readAsDataURL(file);
    }

    render() {
        return(
            <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <Navbar/>
                <h1 style={{textAlign: "center", padding: "10px", marginBottom: "auto"}}>Nueva pregunta</h1>
                <div style={{marginBottom: "auto"}}>
                    <form id="inputFormWide" onSubmit={this.addQuestion}>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Pregunta</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({question: e.target.value})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Opción 1</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({answer0: e.target.value})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Opción 2</label>
                            <input type="text" className="form-control" onChange={(e) => this.setState({answer1: e.target.value})} required/>
                        </div>
                        <div style={{paddingBottom: "20px"}}>
                            <label style={{fontWeight: "bold"}}>Opción 3</label>
                            <input type="text" className="form-control" onChange={(e) => e.target.value === "" ? this.setState({answer2: e.target.value, answer3: ""}) : this.setState({answer2: e.target.value})}/>
                        </div>
                        {this.state.answer2 !== "" ?
                            <div style={{paddingBottom: "20px"}}>
                                <label style={{fontWeight: "bold"}}>Opción 4</label>
                                <input type="text" className="form-control" onChange={(e) => this.setState({answer3: e.target.value})}/>
                            </div>
                            : null}
                        <div style={{display: "inline-flex", width: "100%", paddingBottom: "20px"}}>
                            <div style={{paddingRight: "40px", width: "22%"}}>
                                <label style={{fontWeight: "bold"}}>Respuesta correcta</label>
                                <select className="form-control" onChange={(e) => this.setState({correct: e.target.value})} required>
                                    <option value="0">1</option>
                                    <option value="1">2</option>
                                    {this.state.answer2 !== "" ? <option value="2">3</option> : null}
                                    {this.state.answer3 !== "" && this.state.answer2 !== "" ? <option value="3">4</option> : null}
                                </select>
                            </div>
                            <div style={{paddingRight: "40px", width: "22%"}}>
                                <label style={{fontWeight: "bold"}}>Tiempo</label>
                                <select className="form-control" onChange={(e) => this.setState({time: e.target.value})}>
                                    <option value="5">5 s</option>
                                    <option value="10">10 s</option>
                                    <option value="20">20 s</option>
                                    <option value="30">30 s</option>
                                    <option value="45">45 s</option>
                                    <option value="60">60 s</option>
                                    <option value="90">90 s</option>
                                    <option value="120">120 s</option>
                                    <option value="240">240 s</option>
                                </select>
                            </div>
                            <div style={{width: "56%", display: "flex"}}>
                                <div style={{display: "flex", flexDirection: "column", width: "70%"}}>
                                    <label style={{fontWeight: "bold"}}>Imagen</label>
                                    <input type="file" accept="image/*" id="imageButton" onChange={this.onFileChange}/>
                                </div>
                                <div style={{width: "30%", display: "flex", justifyContent: "center"}}>
                                    <label id="imgSmall" onDrop={this.onDrop}><img src={this.state.imageSrc || empty}/></label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <input type="submit" value="Crear" id="loginButton"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}


AddQuestion.propTypes = {
    newQuestion: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    quiz: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    match: state.match,
    quiz: state.quiz,
    login: state.login
});

export default connect(mapStateToProps, {newQuestion})(withRouter(AddQuestion));