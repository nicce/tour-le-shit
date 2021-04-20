import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ScorecardForm } from '../scorecard/ScorecardForm';
import Scoreboard, { Player } from '../scoreboard/Scoreboard';
import { Refresh } from '../refresh/Refresh';
import { GetPlayerScores, GetScoreboard } from '../../services/ScoreboardService';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export default function ButtonAppBar() {
    const classes = useStyles();
    const [state, setState] = useState({ scoreboard: [], scores: new Map() });

    useEffect(() => {
        fetchScoreboard();
    }, []);

    const fetchScoreboard = async () => {
        const res = await GetScoreboard();
        let scoresState = new Map();
        res.forEach((player: Player) => {
            GetPlayerScores(player.name).then((scores) => {
                scoresState.set(player.name, scores);
            });
        });
        setState({ scoreboard: res, scores: scoresState });
    };

    return (
        <div className={classes.root}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' className={classes.title}>
                        Tour Le Shit &#128169;
                    </Typography>
                    <ScorecardForm updateState={fetchScoreboard} />
                    <Refresh />
                </Toolbar>
            </AppBar>
            <Scoreboard players={state.scoreboard} scores={state.scores} updateState={fetchScoreboard} />
        </div>
    );
}
