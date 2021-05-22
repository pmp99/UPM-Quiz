import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from "@material-ui/core/Typography";

export default class DialogInfoImport extends Component {
    handleClose(){
        this.props.handleClose()
    }

    render() {
        return(
            <Dialog
                open={this.props.open}
                onClose={this.handleClose.bind(this)}
                maxWidth="md"
            >
                <DialogTitle>
                    <div style={{display: "flex", alignItems: 'center'}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            Importar preguntas
                        </Typography>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        El formato de archivo compatible con el sistema de importación de preguntas
                        es el formato Aiken. El número de opciones para cada pregunta puede variar entre 2 y 4. Además,
                        se pueden declarar tantas respuestas correctas como opciones haya.<br/>
                        Nótese que en cada opción el símbolo utilizado para separar la letra de la respuesta puede ser
                        un punto '.' o un paréntesis ')'<br/>
                        Las preguntas se crean con un tiempo predeterminado de 20 segundos.<br/>
                        A continuación se muestra un ejemplo:<br/><br/>
                        <code>
                            ¿Cuál es la capital de España?<br/>
                            A. Toledo<br/>
                            B. Valladolid<br/>
                            C. Madrid<br/>
                            D. Barcelona<br/>
                            ANSWER: C<br/><br/>
                            ¿Cuál de estos valores es solución a la ecuación x² = 4?<br/>
                            A) 2<br/>
                            B) 0<br/>
                            C) -2<br/>
                            ANSWER: A, C
                        </code>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        );
    }
}