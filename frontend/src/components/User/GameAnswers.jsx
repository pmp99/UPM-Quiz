import React from 'react';
import square from '../../assets/square.svg'
import diamond from '../../assets/diamond.svg'
import circle from '../../assets/circle.svg'
import triangle from '../../assets/triangle.svg'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class GameAnswers extends React.Component {

    render() {
        let sum = this.props.answers.reduce((a, b) => a + b, 0)
        let height0 = (10+120*this.props.answers[0]/sum) + "px"
        let height1 = (10+120*this.props.answers[1]/sum) + "px"
        let height2 = (10+120*this.props.answers[2]/sum) + "px"
        let height3 = (10+120*this.props.answers[3]/sum) + "px"
        let correct = JSON.parse(this.props.question.correctAnswer)
        if(this.props.question !== undefined){
            return(
                <div style={{height: "100vh", display: "inline-flex", justifyContent: "space-between", flexDirection: "column", width: "100vw"}}>
                    <div>
                        <nav style={{backgroundColor: "white", borderBottom: "2px solid black"}}>
                            <h1 style={{textAlign: "center", padding: "10px"}}>{this.props.question.question}</h1>
                        </nav>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <button id="exitButton" onClick={this.props.exit}><h5>Salir</h5></button>
                            <button id="nextButton" onClick={this.props.next}><h5>Siguiente</h5></button>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", flexGrow: "1"}}>
                        <div style={{display: "flex", alignItems: "flex-end"}}>
                            {correct.includes(0) ? <div style={{border: "none"}} className="podium"><div id="text0"><i id="check0" className="fas fa-check"/> {this.props.answers[0]}</div><div id="n0" style={{height: height0}}/>
                                <div id="bar0"><img id="barimg" src={triangle} alt="Triangulo"/></div></div> :
                            <div  style={{border: "none"}} className="podium"><div id="text0">{this.props.answers[0]}</div><div id="n0" style={{height: height0}}/>
                                <div id="bar0"><img id="barimg" src={triangle} alt="Triangulo"/></div></div>}
                            {correct.includes(1) ? <div style={{border: "none"}} className="podium"><div id="text1"><i id="check1" className="fas fa-check"/> {this.props.answers[1]}</div><div id="n1" style={{height: height1}}/>
                                    <div id="bar1"><img id="barimg" src={diamond} alt="Rombo"/></div></div> :
                                <div  style={{border: "none"}} className="podium"><div id="text1">{this.props.answers[1]}</div><div id="n1" style={{height: height1}}/>
                                    <div id="bar1"><img id="barimg" src={diamond} alt="Rombo"/></div></div>}
                            {this.props.question.answer2 === "" ? null : correct.includes(2) ? <div style={{border: "none"}} className="podium"><div id="text2"><i id="check2" className="fas fa-check"/> {this.props.answers[2]}</div><div id="n2" style={{height: height2}}/>
                                    <div id="bar2"><img id="barimg" src={circle} alt="Circulo"/></div></div> :
                                <div  style={{border: "none"}} className="podium"><div id="text2">{this.props.answers[2]}</div><div id="n2" style={{height: height2}}/>
                                    <div id="bar2"><img id="barimg" src={circle} alt="Circulo"/></div></div>}
                            {this.props.question.answer3 === "" ? null : correct.includes(3) ? <div style={{border: "none"}} className="podium"><div id="text3"><i id="check3" className="fas fa-check"/> {this.props.answers[3]}</div><div id="n3" style={{height: height3}}/>
                                    <div id="bar3"><img id="barimg" src={square} alt="Cuadrado"/></div></div> :
                                <div  style={{border: "none"}} className="podium"><div id="text3">{this.props.answers[3]}</div><div id="n3" style={{height: height3}}/>
                                    <div id="bar3"><img id="barimg" src={square} alt="Cuadrado"/></div></div>}
                        </div>
                    </div>
                    <div style={{height: "38vh", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <div className="questionRow" style={{marginBottom: "4px"}}>
                        {correct.includes(0) ? <div className="respuestas" id="respuesta-0" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={triangle} alt="Triangulo"/>{this.props.question.answer0}<i id="check" className="fas fa-check"/></div></div>:
                            <div className="respuestas" id="respuesta-0-wrong" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={triangle} alt="Triangulo"/>{this.props.question.answer0}</div></div>}
                            {correct.includes(1) ? <div className="respuestas" id="respuesta-1" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={diamond} alt="Rombo"/>{this.props.question.answer1}<i id="check" className="fas fa-check"/></div></div>:
                                <div className="respuestas" id="respuesta-1-wrong" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={diamond} alt="Rombo"/>{this.props.question.answer1}</div></div>}
                        </div>
                        {this.props.question.answer2 !== "" || this.props.question.answer3 !== "" ?
                        <div className="questionRow" style={{marginBottom: "4px"}}>
                        {this.props.question.answer2 === "" ? null : correct.includes(2) ?
                            <div className="respuestas" id="respuesta-2" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={circle} alt="Circulo"/>{this.props.question.answer2}<i id="check" className="fas fa-check"/></div></div> :
                            <div className="respuestas" id="respuesta-2-wrong" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={circle} alt="Circulo"/>{this.props.question.answer2}</div></div>}
                        {this.props.question.answer3 === "" ? <div className="respuestas" id="respuesta-vacia" style={{marginLeft: "4px", marginRight: "2px"}}/> : correct.includes(3) ?
                            <div className="respuestas" id="respuesta-3" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={square} alt="Cuadrado"/>{this.props.question.answer3}<i id="check" className="fas fa-check"/></div></div> :
                            <div className="respuestas" id="respuesta-3-wrong" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={square} alt="Cuadrado"/>{this.props.question.answer3}</div></div>}
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
