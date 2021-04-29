import React from 'react';
import square from '../../assets/square.svg'
import diamond from '../../assets/diamond.svg'
import circle from '../../assets/circle.svg'
import triangle from '../../assets/triangle.svg'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class Respuestas extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let sum = this.props.answers.reduce((a, b) => a + b, 0)
        let height0 = (10+120*this.props.answers[0]/sum).toString()+"px"
        let height1 = (10+120*this.props.answers[1]/sum).toString()+"px"
        let height2 = (10+120*this.props.answers[2]/sum).toString()+"px"
        let height3 = (10+120*this.props.answers[3]/sum).toString()+"px"
        let correct = JSON.parse(this.props.pregunta.correctAnswer)
        if(this.props.pregunta !== undefined){
            return(
                <div style={{height: "100vh", display: "inline-flex", justifyContent: "space-between", flexDirection: "column", width: "100vw"}}>
                    <div>
                        <nav style={{backgroundColor: "white", borderBottom: "2px solid black"}}>
                            <h1 style={{textAlign: "center", padding: "10px"}}>{this.props.pregunta.question}</h1>
                        </nav>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <button id="exitButton" onClick={this.props.salir}><h5>Salir</h5></button>
                            <button id="nextButton" onClick={this.props.next}><h5>Siguiente</h5></button>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", flexDirection: "row", width: "100vw", flexGrow: "1"}}>
                        <table className="table" style={{margin: "auto auto"}}>
                            <tbody>
                            <tr style={{border: "none"}}>
                                {correct.includes(0) ? <td  style={{border: "none"}} className="podium-td"><div id="text0"><i id="check0" className="fas fa-check"/> {this.props.answers[0]}</div><div id="n0" style={{height: height0}}/>
                                    <div id="bar0"><img id="barimg" src={triangle}/></div></td> :
                                <td  style={{border: "none"}} className="podium-td"><div id="text0">{this.props.answers[0]}</div><div id="n0" style={{height: height0}}/>
                                    <div id="bar0"><img id="barimg" src={triangle}/></div></td>}
                                {correct.includes(1) ? <td  style={{border: "none"}} className="podium-td"><div id="text1"><i id="check1" className="fas fa-check"/> {this.props.answers[1]}</div><div id="n1" style={{height: height1}}/>
                                        <div id="bar1"><img id="barimg" src={diamond}/></div></td> :
                                    <td  style={{border: "none"}} className="podium-td"><div id="text1">{this.props.answers[1]}</div><div id="n1" style={{height: height1}}/>
                                        <div id="bar1"><img id="barimg" src={diamond}/></div></td>}
                                {this.props.pregunta.answer2 === "" ? null : correct.includes(2) ? <td  style={{border: "none"}} className="podium-td"><div id="text2"><i id="check2" className="fas fa-check"/> {this.props.answers[2]}</div><div id="n2" style={{height: height2}}/>
                                        <div id="bar2"><img id="barimg" src={circle}/></div></td> :
                                    <td  style={{border: "none"}} className="podium-td"><div id="text2">{this.props.answers[2]}</div><div id="n2" style={{height: height2}}/>
                                        <div id="bar2"><img id="barimg" src={circle}/></div></td>}
                                {this.props.pregunta.answer3 === "" ? null : correct.includes(3) ? <td  style={{border: "none"}} className="podium-td"><div id="text3"><i id="check3" className="fas fa-check"/> {this.props.answers[3]}</div><div id="n3" style={{height: height3}}/>
                                        <div id="bar3"><img id="barimg" src={square}/></div></td> :
                                    <td  style={{border: "none"}} className="podium-td"><div id="text3">{this.props.answers[3]}</div><div id="n3" style={{height: height3}}/>
                                        <div id="bar3"><img id="barimg" src={square}/></div></td>}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{height: "38vh", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <div className="questionRow" style={{marginBottom: "4px"}}>
                        {correct.includes(0) ? <div className="respuestas" id="respuesta-0" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={triangle}/>{this.props.pregunta.answer0}<i id="check" className="fas fa-check"/></div></div>:
                            <div className="respuestas" id="respuesta-0-wrong" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={triangle}/>{this.props.pregunta.answer0}<i id="check" className="fas fa-times"/></div></div>}
                            {correct.includes(1) ? <div className="respuestas" id="respuesta-1" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={diamond}/>{this.props.pregunta.answer1}<i id="check" className="fas fa-check"/></div></div>:
                                <div className="respuestas" id="respuesta-1-wrong" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={diamond}/>{this.props.pregunta.answer1}<i id="check" className="fas fa-times"/></div></div>}
                        </div>
                        {this.props.pregunta.answer2 !== "" || this.props.pregunta.answer3 !== "" ?
                        <div className="questionRow" style={{marginBottom: "4px"}}>
                        {this.props.pregunta.answer2 === "" ? null : correct.includes(2) ?
                            <div className="respuestas" id="respuesta-2" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={circle}/>{this.props.pregunta.answer2}<i id="check" className="fas fa-check"/></div></div> :
                            <div className="respuestas" id="respuesta-2-wrong" style={{marginLeft: "4px", marginRight: "2px"}}><div className="answ"><img src={circle}/>{this.props.pregunta.answer2}<i id="check" className="fas fa-times"/></div></div>}
                        {this.props.pregunta.answer3 === "" ? <div className="respuestas" id="respuesta-vacia" style={{marginLeft: "4px", marginRight: "2px"}}/> : correct.includes(3) ?
                            <div className="respuestas" id="respuesta-3" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={square}/>{this.props.pregunta.answer3}<i id="check" className="fas fa-check"/></div></div> :
                            <div className="respuestas" id="respuesta-3-wrong" style={{marginLeft: "2px", marginRight: "4px"}}><div className="answ"><img src={square}/>{this.props.pregunta.answer3}<i id="check" className="fas fa-times"/></div></div>}
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
