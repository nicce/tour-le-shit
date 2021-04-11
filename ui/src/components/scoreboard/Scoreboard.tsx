import React, { Component } from 'react';
import { GetPlayerScores, GetScoreboard, DeletePlayerScore } from '../../services/ScoreboardService';

import { TableContainer } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

interface Player {
    name: string;
    points: number;
    lastPlayed: string;
    holderOfSnek: boolean;
}

interface Score {
    id: number;
    name: string;
    points: number;
    holderOfSnek: boolean;
    nettoTweets: number;
    nettoEagles: number;
    muligans: number;
    date: string;
}

class Scoreboard extends Component {
    state = {
        scoreboard: [],
        scores: new Map(),
        open: new Map(),
    };

    setOpen(name: string) {
        const isOpen = this.state.open.get(name);
        this.state.open.set(name, !isOpen);
        this.setState({ open: this.state.open });
    }

    async deleteScore(id: number, name: string) {
        await DeletePlayerScore(id);
        let openState = new Map();
        const res = await GetScoreboard();
        let scoresState = new Map();
        res.forEach((player: Player) => {
            openState.set(player.name, false);
            GetPlayerScores(player.name).then((scores) => {
                scoresState.set(player.name, scores);
            });
        });
        this.setState({ scoreboard: res, scores: scoresState, open: openState });
    }

    componentDidMount() {
        let openState = new Map();
        GetScoreboard().then((res) => {
            let scoresState = new Map();
            res.forEach((player: Player) => {
                openState.set(player.name, false);
                GetPlayerScores(player.name).then((scores) => {
                    scoresState.set(player.name, scores);
                });
            });
            this.setState({ scoreboard: res, scores: scoresState, open: openState });
        });
    }

    render() {
        const tableRowStyle = {
            borderBottom: 'unset',
        };
        return (
            <TableContainer>
                <Table size='medium'>
                    <TableHead>
                        <TableRow style={tableRowStyle}>
                            <TableCell padding='none'>Name</TableCell>
                            <TableCell padding='none'>Points</TableCell>
                            <TableCell padding='none'>Last played</TableCell>
                            <TableCell padding='none'>Snek</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.scoreboard.map((player: Player) => (
                            <React.Fragment>
                                <TableRow key={player.name}>
                                    <TableCell padding='none' onClick={() => this.setOpen(player.name)}>
                                        {player.name}
                                    </TableCell>
                                    <TableCell padding='none' component='th' scope='row'>
                                        {player.points}
                                    </TableCell>
                                    <TableCell padding='none'>{player.lastPlayed}</TableCell>
                                    <TableCell padding='none'>
                                        {player.holderOfSnek ? String.fromCodePoint(0x1f40d) : ''}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 10, paddingTop: 10 }} colSpan={6}>
                                        <Collapse in={this.state.open.get(player.name)} timeout='auto' unmountOnExit>
                                            <Box margin={0}>
                                                <Typography variant='h6' gutterBottom component='div'>
                                                    History
                                                </Typography>
                                                <Table size='small' aria-label='purchases'>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell padding='none'>
                                                                {String.fromCodePoint(0x1f4c5)}
                                                            </TableCell>
                                                            <TableCell padding='none'>
                                                                {String.fromCodePoint(0x1f3cc)}
                                                            </TableCell>
                                                            <TableCell padding='none'>
                                                                {String.fromCodePoint(0x1f426)}
                                                            </TableCell>
                                                            <TableCell padding='none'>
                                                                {String.fromCodePoint(0x1f985)}
                                                            </TableCell>
                                                            <TableCell padding='none'>
                                                                {String.fromCodePoint(0x1f40d)}
                                                            </TableCell>
                                                            <TableCell padding='none'>
                                                                {String.fromCodePoint(0x1f373)}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    {this.state.scores.get(player.name) ? (
                                                        <TableBody>
                                                            {this.state.scores.get(player.name).map((score: Score) => (
                                                                <TableRow key={score.id}>
                                                                    <TableCell
                                                                        padding='none'
                                                                        component='th'
                                                                        scope='row'
                                                                    >
                                                                        {score.date}
                                                                    </TableCell>
                                                                    <TableCell padding='none'>{score.points}</TableCell>
                                                                    <TableCell padding='none'>
                                                                        {score.nettoTweets}
                                                                    </TableCell>
                                                                    <TableCell padding='none'>
                                                                        {score.nettoEagles}
                                                                    </TableCell>
                                                                    <TableCell padding='none'>
                                                                        {score.holderOfSnek
                                                                            ? String.fromCodePoint(0x1f40d)
                                                                            : ''}
                                                                    </TableCell>
                                                                    <TableCell padding='none'>
                                                                        {score.muligans}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        padding='none'
                                                                        onClick={() =>
                                                                            this.deleteScore(
                                                                                score.id,
                                                                                player.name,
                                                                            ).then()
                                                                        }
                                                                    >
                                                                        <DeleteIcon />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    ) : (
                                                        <TableBody></TableBody>
                                                    )}
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default Scoreboard;
