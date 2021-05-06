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

export default class DialogLogin extends Component {
    handleClose(value, event){
        event.preventDefault()
        this.props.handleClose(value)
    }

    handleChange(type, event){
        this.props.handleChange(event.target.value, type)
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
                    <div style={{display: "flex"}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            Iniciar sesión con Moodle
                        </Typography>
                        <Button onClick={this.handleClose.bind(this, false)} color="secondary">
                            <CloseIcon />
                        </Button>
                    </div>
                </DialogTitle>

                <DialogContent dividers>
                    <form id="loginForm" style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}} onSubmit={this.handleClose.bind(this, true)}>
                        <FormControl variant="outlined" style={{width: "100%", marginBottom: "40px"}}>
                            <InputLabel>Correo electrónico</InputLabel>
                            <Input value={this.props.email} onChange={this.handleChange.bind(this, 'email')} required />
                        </FormControl>
                        <FormControl variant="outlined" style={{width: "100%"}}>
                            <InputLabel>Contraseña</InputLabel>
                            <Input type="password" value={this.props.password} onChange={this.handleChange.bind(this, 'password')} required />
                        </FormControl>
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button type="submit" color="primary" form="loginForm" variant="contained">
                        Iniciar sesión
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}