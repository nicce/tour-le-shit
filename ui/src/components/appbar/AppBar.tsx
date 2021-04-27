import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ScorecardForm } from '../scorecard/ScorecardForm';
import Scoreboard, { Player } from '../scoreboard/Scoreboard';
import PullToRefresh from 'react-simple-pull-to-refresh';
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

    const handleRefresh = async (): Promise<any> => {
        window.location.reload();
    };

    return (
        <div className={classes.root}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h5' className={classes.title}>
                        Tour Le Shit &#128169;
                    </Typography>
                    <ScorecardForm updateState={fetchScoreboard} />
                </Toolbar>
            </AppBar>
            <div style={{ paddingTop: '10px' }}></div>
            <PullToRefresh onRefresh={handleRefresh}>
                <Scoreboard players={state.scoreboard} scores={state.scores} updateState={fetchScoreboard} />
            </PullToRefresh>
        </div>
    );
}
