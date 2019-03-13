import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 120,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
});

class MainMenuGrid extends React.Component {
    constructor(props) {
        super(props);
        console.log(window.electron);
        const { ipcRenderer } = window.electron;
        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            console.log(arg) // prints "pong"
        });
        ipcRenderer.send('asynchronous-message', 'ping')
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container className={classes.root} spacing={16} >
                <Grid item xs={12}>
                    <Grid container className={classes.demo} justify="center" spacing={40}>
                        {[0, 1, 2].map(value => (
                            <Grid key={value} item>
                                <Paper className={classes.paper} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

            </Grid>
        );
    }
}

export default withStyles(styles)(MainMenuGrid);
