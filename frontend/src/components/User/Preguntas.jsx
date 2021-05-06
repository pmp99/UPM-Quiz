import React from 'react';
import square from '../../assets/square.svg'
import diamond from '../../assets/diamond.svg'
import circle from '../../assets/circle.svg'
import triangle from '../../assets/triangle.svg'
import logo from '../../assets/Logo.png'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class Preguntas extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        if(this.props.pregunta !== undefined){
            let image = this.props.pregunta.image
            if (image === "") {
                image = logo
            }
            return(
                <div style={{height: "100vh", display: "inline-flex", justifyContent: "space-between", flexDirection: "column"}}>
                    <nav style={{backgroundColor: "white", borderBottom: "2px solid black"}}>
                        <h1 style={{textAlign: "center", padding: "10px"}}>{this.props.pregunta.question}</h1>
                        <div id="skipButton"><button id="nextButton" onClick={this.props.skip}><h5>Saltar</h5></button></div>
                    </nav>
                    <div style={{display: "flex", justifyContent: "center", flexDirection: "row", width: "100vw", flexGrow: "1"}}>
                        <div id="time"><h1 style={{margin: "auto auto"}}>{this.props.tiempo === Number.MIN_SAFE_INTEGER ? 0 : this.props.tiempo}</h1></div>
                        <div id="imgContainer"><img src={image} id="imagen-juego"/></div>
                        <div id="nAnswers"><h1 style={{margin: "auto auto"}}>{this.props.n}<br/>Respuestas</h1></div>
                    </div>
                    <div style={{height: "38vh", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <div className="questionRow" style={{marginBottom: "4px"}}>
                            <div className="respuestas" id="respuesta-0" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={triangle}/>{this.props.pregunta.answer0}</div></div>
                            <div className="respuestas" id="respuesta-1" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={diamond}/>{this.props.pregunta.answer1}</div></div>
                        </div>
                        {this.props.pregunta.answer2 !== "" || this.props.pregunta.answer3 !== "" ?
                        <div className="questionRow" style={{marginBottom: "4px"}}>
                            {this.props.pregunta.answer2 === "" ? null : <div className="respuestas" id="respuesta-2" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={circle}/>{this.props.pregunta.answer2}</div></div>}
                            {this.props.pregunta.answer3 === "" ? <div className="respuestas" id="respuesta-vacia" style={{marginLeft: "4px", marginRight: "2px"}}/> :
                                <div className="respuestas" id="respuesta-3" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={square}/>{this.props.pregunta.answer3}</div></div>}
                        </div>
                            : null}
                    </div>
                </div>
            );
        }else{
            return(
                <div style={{height: "100vh", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <Backdrop style={{color: "black", zIndex: "1"}} open={true}>
                        <CircularProgress style={{color: "white"}} size={80} />
                    </Backdrop>
                </div>
            )
        }
    }
}
