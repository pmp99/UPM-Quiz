import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";

export default class DialogAssignment extends Component {
    handleClose(value){
        this.props.handleClose(value)
    }

    handleChangeCourse(event){
        this.props.handleChangeCourse(event)
    }

    handleChangeAssignment(event){
        this.props.handleChangeAssignment(event)
    }

    handleChangeMin(event, value){
        this.props.handleChangeMin(value)
    }

    handleChangeMax(event, value){
        this.props.handleChangeMax(value)
    }

    render() {
        return(
            <Dialog
                aria-labelledby="confirmation-dialog-title"
                open={this.props.open}
                maxWidth="md"
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
            >
                <DialogTitle id="confirmation-dialog-title">
                    <div style={{display: "flex"}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            Asignar tarea al juego
                        </Typography>
                        <Button onClick={this.handleClose.bind(this, false)} color="secondary">
                            <CloseIcon />
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "space-between"}}>
                        <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2%", paddingRight: "4%"}}>
                            <div style={{marginBottom: "1%", width: "100%"}}>
                                <InputLabel id="demo-simple-select-label">Curso</InputLabel>
                                {this.props.courses.length > 0 ?
                                <Select
                                    fullWidth
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.props.course}
                                    onChange={this.handleChangeCourse.bind(this)}
                                >
                                    {this.props.courses.map((course) => (
                                        <MenuItem value={course.id} key={course.id}>{course.shortname}</MenuItem>
                                    ))}
                                </Select>
                                    : "No eres profesor en ningún curso"}
                            </div>
                            <div style={{marginTop: "1%", width: "100%"}}>
                                <InputLabel id="demo-simple-select-label">Tarea</InputLabel>
                                {this.props.assignments.length > 0 ?
                                <Select
                                    fullWidth
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.props.assignment}
                                    onChange={this.handleChangeAssignment.bind(this)}
                                >
                                    {this.props.assignments.map((assignment) => (
                                        <MenuItem value={assignment.id} key={assignment.id}>{assignment.name}</MenuItem>
                                    ))}
                                </Select>
                                    : this.props.course === 0 ? "Seleccione un curso para ver sus tareas" : "No hay tareas"}
                            </div>
                        </div>

                        <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2%", paddingLeft: "4%"}}>
                            <div style={{marginBottom: "1%", width: "100%"}}>
                                <InputLabel id="demo-simple-select-label">Aciertos mínimos para puntuar: {this.props.min}</InputLabel>
                                <Slider
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    value={this.props.min}
                                    min={0}
                                    max={Math.min(this.props.max - 1, this.props.nQuestions - 1)}
                                    onChange={this.handleChangeMin.bind(this)}
                                    disabled={Math.min(this.props.max - 1, this.props.nQuestions - 1) === 0}
                                />
                            </div>
                            <div style={{marginTop: "1%", width: "100%"}}>
                                <InputLabel id="demo-simple-select-label">Aciertos para obtener la máxima nota: {this.props.max}</InputLabel>
                                <Slider
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    value={this.props.max}
                                    min={Math.max(1, this.props.min + 1)}
                                    max={this.props.nQuestions}
                                    onChange={this.handleChangeMax.bind(this)}
                                    disabled={Math.max(1, this.props.min + 1) === this.props.nQuestions}
                                />
                            </div>
                            <h6>Número de preguntas: {this.props.nQuestions}</h6>
                        </div>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this, true)} color="primary" disabled={this.props.assignment === 0}>
                        Comenzar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}