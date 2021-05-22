import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';

export default class DialogQuiz extends Component {
    handleClose(value, editMode, event){
        event.preventDefault()
        this.props.handleClose(value, editMode)
    }

    handleChange(event){
        this.props.handleChange(event.target.value)
    }

    render() {
        return(
            <Dialog
                aria-labelledby="confirmation-dialog-title"
                open={this.props.open}
                maxWidth="xs"
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
            >
                <DialogTitle id="confirmation-dialog-title">
                    <div style={{display: "flex", alignItems: 'center'}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            {this.props.edit ? "Editar quiz" : "Nuevo quiz"}
                        </Typography>
                        <Button onClick={this.handleClose.bind(this, false, null)} color="secondary">
                            <CloseIcon />
                        </Button>
                    </div>
                </DialogTitle>

                <DialogContent dividers>
                    <form id="quizForm" style={{width: "100%", display: "flex", justifyContent: "space-between"}} onSubmit={this.handleClose.bind(this, true, this.props.edit)}>
                        <FormControl variant="outlined" style={{width: "100%"}}>
                            <InputLabel>Nombre del quiz</InputLabel>
                            <Input value={this.props.name} onChange={this.handleChange.bind(this)} required />
                        </FormControl>
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button type="submit" color="primary" form="quizForm" variant="contained">
                        {this.props.edit ? "Guardar cambios" : "Crear quiz"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}