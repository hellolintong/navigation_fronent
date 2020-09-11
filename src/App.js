import React from 'react';
import Selector from './selector';
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';

import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    cardGrid: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(8),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    }
}));

export default function App() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar position="relative">
                <Toolbar>
                    <CameraIcon className={classes.icon}/>
                    <Typography variant="h6" color="inherit" noWrap>
                        CodeViewer
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            CodeViewer
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Golang开源项目结构梳理
                        </Typography>
                    </Container>
                </div>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={2}/>
                    <Grid item xs={12} sm={8}>
                     <Selector/>
                    </Grid>
                    <Grid item xs={12} sm={2}/>
                </Grid>
            </main>
        </React.Fragment>
    );
}
