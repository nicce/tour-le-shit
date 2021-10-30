import React, { useState, useEffect } from 'react';
import { ScorecardForm } from '../scorecard/ScorecardForm';
import { SeasonMenu } from '../seasonmenu/SeasonMenu';
import Scoreboard, { Player } from '../scoreboard/Scoreboard';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { GetPlayerScores, GetScoreboard } from '../../services/ScoreboardService';
import { AppBar, Toolbar, Typography } from '@mui/material';

export default function ButtonAppBar() {
    const [state, setState] = useState({ scoreboard: [], scores: new Map() });
    const [season, setSeason] = useState(1); // Default season, will be changed to 2 next year.
    useEffect(() => {
        fetchScoreboard();
    }, [season]);

    const fetchScoreboard = async () => {
        const res = await GetScoreboard(season);
        let scoresState = new Map();
        res.forEach((player: Player) => {
            GetPlayerScores(player.name, season).then((scores) => {
                scoresState.set(player.name, scores);
            });
        });
        setState({ scoreboard: res, scores: scoresState });
    };

    const handleRefresh = async (): Promise<any> => {
        window.location.reload();
    };

    return (
        <>
            <AppBar position='static' sx={{ maxWidth: '600px', margin: ' auto', borderRadius: 2 }}>
                <Toolbar>
                    <Typography variant='h5' component='h1' sx={{ flexGrow: 1 }}>
                        Tour Le Shit &#128169;
                    </Typography>
                    <ScorecardForm season={season} updateState={fetchScoreboard} />
                    <SeasonMenu season={season} setSeason={setSeason} />
                </Toolbar>
            </AppBar>
            <PullToRefresh onRefresh={handleRefresh}>
                <Scoreboard players={state.scoreboard} scores={state.scores} updateState={fetchScoreboard} />
            </PullToRefresh>
        </>
    );
}
