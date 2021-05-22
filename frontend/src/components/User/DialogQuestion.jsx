import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import empty from "../../assets/empty.jpg";

export default class DialogQuestion extends Component {
    handleClose(value, editMode, event){
        event.preventDefault()
        this.props.handleClose(value, editMode)
    }

    handleChange(value, name, event){
        if (event !== undefined && !name.startsWith('correct')) {
            if (name.startsWith('answer') && event.target.value === "") {
                this.props.handleChange(false, 'correct'+name.charAt(name.length-1))
            }
            this.props.handleChange(event.target.value, name)
        } else {
            if (name.startsWith('correct')) {
                this.props.handleChange(event.target.checked, name)
            } else {
                this.props.handleChange(value, name)
            }
        }
    }

    onFileChange(e, file){
        let archivo = file || e.target.files[0]
        let pattern = /image-*/
        let reader = new FileReader()

        if (!archivo.type.match(pattern)) {
            return
        }

        reader.onload = (e) => {
            this.handleChange(reader.result, 'imageSrc')
            this.handleChange(archivo, 'file')
        }
        reader.readAsDataURL(archivo);
    }

    onDrop(e){
        e.preventDefault();
        this.onFileChange(e, e.dataTransfer.files[0]);
    }

    render() {
        const correct = this.props.newQuestion.correct
        return(
            <Dialog
                aria-labelledby="confirmation-dialog-title"
                open={this.props.open}
                maxWidth="xl"
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
            >
                <DialogTitle id="confirmation-dialog-title">
                    <div style={{display: "flex", alignItems: 'center'}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            {this.props.edit ? "Editar pregunta" : "Nueva pregunta"}
                        </Typography>
                        <Button onClick={this.handleClose.bind(this, false, false)} color="secondary">
                            <CloseIcon />
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <form id="questionForm" style={{height: "400px", width: "100%", display: "flex", justifyContent: "space-between"}} onSubmit={this.handleClose.bind(this, true, this.props.edit)}>
                        <div style={{height: "100%", width: "70%", display: "flex", flexDirection: "column", justifyContent: "space-around", paddingRight: "2%"}}>
                            <FormControl variant="outlined">
                                <InputLabel>Pregunta</InputLabel>
                                <Input value={this.props.newQuestion.question} onChange={this.handleChange.bind(this, null, 'question')} required />
                            </FormControl>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                                <FormControl variant="outlined" style={{width: '92%'}}>
                                    <InputLabel>Opción 1</InputLabel>
                                    <Input value={this.props.newQuestion.answer0} onChange={this.handleChange.bind(this, null, 'answer0')} required />
                                </FormControl>
                                <Checkbox checked={correct.includes(0)} onChange={this.handleChange.bind(this, null, 'correct0')} style={{color: 'green'}} />
                            </div>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                                <FormControl variant="outlined" style={{width: '92%'}}>
                                    <InputLabel>Opción 2</InputLabel>
                                    <Input value={this.props.newQuestion.answer1} onChange={this.handleChange.bind(this, null, 'answer1')} required />
                                </FormControl>
                                <Checkbox checked={correct.includes(1)} onChange={this.handleChange.bind(this, null, 'correct1')} style={{color: 'green'}} />
                            </div>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                                <FormControl variant="outlined" style={{width: '92%'}}>
                                    <InputLabel>Opción 3</InputLabel>
                                    <Input value={this.props.newQuestion.answer2} onChange={this.handleChange.bind(this, null, 'answer2')} />
                                </FormControl>
                                <Checkbox checked={correct.includes(2)} onChange={this.handleChange.bind(this, null, 'correct2')} disabled={this.props.newQuestion.answer2 === ""} style={{color: 'green'}} />
                            </div>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                                <FormControl variant="outlined" style={{width: '92%'}} disabled={this.props.newQuestion.answer2 === ""} >
                                    <InputLabel>Opción 4</InputLabel>
                                    <Input value={this.props.newQuestion.answer3} onChange={this.handleChange.bind(this, null, 'answer3')} />
                                </FormControl>
                                <Checkbox checked={correct.includes(3)} onChange={this.handleChange.bind(this, null, 'correct3')} disabled={this.props.newQuestion.answer2 === "" || this.props.newQuestion.answer3 === ""} style={{color: 'green'}} />
                            </div>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div style={{display: "flex", flexDirection: "column", width: "20%"}}>
                                    <InputLabel style={{marginLeft: '15px'}}>Tiempo</InputLabel>
                                    <Select
                                        fullWidth
                                        value={this.props.newQuestion.time}
                                        onChange={this.handleChange.bind(this, null, 'time')}
                                        required
                                    >
                                        <MenuItem value={"5"}>5 s</MenuItem>
                                        <MenuItem value={"10"}>10 s</MenuItem>
                                        <MenuItem value={"20"}>20 s</MenuItem>
                                        <MenuItem value={"30"}>30 s</MenuItem>
                                        <MenuItem value={"45"}>45 s</MenuItem>
                                        <MenuItem value={"60"}>60 s</MenuItem>
                                        <MenuItem value={"90"}>90 s</MenuItem>
                                        <MenuItem value={"120"}>120 s</MenuItem>
                                        <MenuItem value={"240"}>240 s</MenuItem>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <Divider orientation="vertical" />
                        <div style={{height: "100%", width: "30%", display: "flex", flexDirection: "column", justifyContent: "space-around", paddingLeft: "2%"}}>
                            <label id="imgSmall" onDrop={this.onDrop.bind(this)}><img style={{height: "100%", width: "100%", objectFit: "contain", padding: "10px"}} src={this.props.newQuestion.imageSrc || empty} alt="Imagen de la pregunta"/></label>
                            <div style={{display: "flex", width: "100%", height: "20%", justifyContent: "space-around", alignItems: "center"}}>
                                <input type="file" accept="image/*" id="imageButton" style={{display: "none"}} onChange={this.onFileChange.bind(this)}/>
                                <label htmlFor="imageButton" style={{display: "flex", justifyContent: "center", width: "35%", height: "80%", margin: "0"}}>
                                    <Button variant="contained" component="span" size="small" style={{width: "100%", height: "100%", textAlign: "center"}}>
                                        Subir imagen
                                    </Button>
                                </label>
                                <Button onClick={this.handleChange.bind(this, null, 'removeImage')} color="secondary" size="small" variant="contained" style={{width: "35%", height: "80%", cursor: 'pointer'}}>
                                    Eliminar imagen
                                </Button>
                            </div>
                        </div>
                    </form>

                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="primary" form="questionForm" variant="contained" disabled={correct.length === 0}>
                        {this.props.edit ? "Guardar cambios" : "Crear pregunta"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}