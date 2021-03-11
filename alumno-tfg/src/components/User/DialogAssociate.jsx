import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";

export default class DialogAssociate extends Component {
    handleClose(value){
        this.props.handleClose(value)
    }

    render() {
        return(
            <Dialog
                open={this.props.open}
                onClose={this.handleClose.bind(this, null)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="confirmation-dialog-title">
                    <div style={{display: "flex"}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            ¿Asignar cuestionario a una tarea de Moodle?
                        </Typography>
                        <Button onClick={this.handleClose.bind(this, null)} color="secondary">
                            <CloseIcon />
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Permite asociar el cuestionario a una tarea de Moodle para que las puntuaciones obtenidas por los alumnos
                        se conviertan automáticamente en una calificación en dicha tarea
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this, false)} color="primary">
                        No
                    </Button>
                    <Button onClick={this.handleClose.bind(this, true)} color="primary">
                        Sí
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}