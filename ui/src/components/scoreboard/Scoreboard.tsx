import React, { useState, useEffect } from 'react';
import { TableContainer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';

import { DeletePlayerScore } from '../../services/ScoreboardService';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    tableCell: {},
});

export type Player = {
    name: string;
    points: number;
    lastPlayed: string;
    holderOfSnek: boolean;
};

type Score = {
    id: number;
    name: string;
    points: number;
    holderOfSnek: boolean;
    nettoTweets: number;
    nettoEagles: number;
    muligans: number;
    date: string;
};

export default function Scoreboard(props: {
    players: Player[];
    scores: Map<string, Score[]>;
    updateState: () => Promise<void>;
}) {
    const [open, setOpen] = useState(new Map());
    const classes = useRowStyles();

    const setOpens = (name: string) => {
        const isOpen = open.get(name);
        // Never mutate a state
        const newOpenState = new Map(open);
        newOpenState.set(name, !isOpen);
        setOpen(newOpenState);
    };

    const deleteScore = async (id: number) => {
        await DeletePlayerScore(id);
        await props.updateState();
    };

    useEffect(() => {
        let openState = new Map();
        props.players.forEach((player) => {
            openState.set(player.name, false);
        });
        setOpen(openState);
    }, [props]);

    return (
        <TableContainer>
            <Table size='medium'>
                <TableHead>
                    <TableRow>
                        <TableCell padding='none'></TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} padding='none'>
                            Name
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} padding='none'>
                            Points
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} padding='none'>
                            Last played
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }} padding='none'>
                            Snek
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.players.map((player: Player) => (
                        <React.Fragment key={player.name}>
                            <TableRow className={classes.root}>
                                <IconButton aria-label='expand row' size='small' onClick={() => setOpens(player.name)}>
                                    {open.get(player.name) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                                <TableCell padding='none'>{player.name}</TableCell>
                                <TableCell key={player.points} padding='none' component='th' scope='row'>
                                    {player.points}
                                </TableCell>
                                <TableCell padding='none'>{player.lastPlayed}</TableCell>
                                <TableCell padding='none'>
                                    {player.holderOfSnek ? String.fromCodePoint(0x1f40d) : ''}
                                </TableCell>
                            </TableRow>
                            <TableRow className={classes.root}>
                                <TableCell colSpan={6}>
                                    <Collapse in={open.get(player.name)} timeout='auto' unmountOnExit>
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
                                                {props.scores.get(player.name) ? (
                                                    <TableBody>
                                                        {props.scores.get(player.name)!.map((score: Score) => (
                                                            <TableRow key={score.id}>
                                                                <TableCell padding='none' component='th' scope='row'>
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
                                                                <TableCell padding='none'>{score.muligans}</TableCell>
                                                                <TableCell
                                                                    padding='none'
                                                                    onClick={() => deleteScore(score.id).then()}
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
