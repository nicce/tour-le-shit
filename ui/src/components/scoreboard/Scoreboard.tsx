import {
    Box,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { DeletePlayerScore } from '../../services/ScoreboardService';
import { useTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
        table: {
            margin: 'auto',
            maxWidth: '600px',
        },
    }),
);

export type Player = {
    name: string;
    points: number;
    lastPlayed: string;
    holderOfSnek: boolean;
    season: number;
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
    season: number;
};

export default function Scoreboard(props: {
    players: Player[];
    scores: Map<string, Score[]>;
    updateState: () => Promise<void>;
}) {
    const [open, setOpen] = useState(new Map());
    const classes = useStyles();
    const theme = useTheme();

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
        <TableContainer component={Paper} sx={{ borderRadius: 2 }} className={classes.table}>
            <Table size='medium'>
                <TableHead>
                    <TableRow>
                        <TableCell padding='none'></TableCell>
                        <TableCell padding='none'></TableCell>
                        <TableCell padding='none'></TableCell>
                        <TableCell padding='none'></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.players.map((player: Player) => (
                        <React.Fragment key={player.name}>
                            <TableRow sx={{ borderRadius: 10 }} className={classes.root}>
                                <TableCell padding='none'>
                                    <IconButton aria-label='expand row' onClick={() => setOpens(player.name)}>
                                        {open.get(player.name) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell
                                    key={player.points}
                                    padding='none'
                                    style={{ fontWeight: 'bold', color: theme.palette.secondary.dark }}
                                >
                                    {player.points}
                                </TableCell>
                                <TableCell style={{ color: theme.palette.secondary.main }} padding='none'>
                                    {player.name}
                                </TableCell>
                                <TableCell padding='none' style={{ color: theme.palette.secondary.light }}>
                                    {player.lastPlayed}
                                </TableCell>
                            </TableRow>
                            <TableRow className={classes.root}>
                                <TableCell colSpan={10}>
                                    <Collapse in={open.get(player.name)} timeout={500} unmountOnExit>
                                        <Box>
                                            <Typography variant='h6' gutterBottom component='div'>
                                                History
                                            </Typography>
                                            <Table size='small' aria-label='purchases'>
                                                <TableHead>
                                                    <TableRow>
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
                                                        <TableCell padding='none'>
                                                            {String.fromCodePoint(0x1f4c5)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {props.scores.get(player.name) ? (
                                                    <TableBody>
                                                        {props.scores.get(player.name)!.map((score: Score) => (
                                                            <TableRow key={score.id}>
                                                                <TableCell
                                                                    padding='none'
                                                                    style={{ color: theme.palette.secondary.dark }}
                                                                >
                                                                    {score.points}
                                                                </TableCell>
                                                                <TableCell
                                                                    padding='none'
                                                                    style={{ color: theme.palette.secondary.dark }}
                                                                >
                                                                    {score.nettoTweets}
                                                                </TableCell>
                                                                <TableCell
                                                                    padding='none'
                                                                    style={{ color: theme.palette.secondary.dark }}
                                                                >
                                                                    {score.nettoEagles}
                                                                </TableCell>
                                                                <TableCell
                                                                    padding='none'
                                                                    style={{ color: theme.palette.secondary.dark }}
                                                                >
                                                                    {score.holderOfSnek
                                                                        ? String.fromCodePoint(0x1f40d)
                                                                        : ''}
                                                                </TableCell>
                                                                <TableCell
                                                                    padding='none'
                                                                    style={{ color: theme.palette.secondary.dark }}
                                                                >
                                                                    {score.muligans}
                                                                </TableCell>
                                                                <TableCell
                                                                    style={{ color: theme.palette.secondary.light }}
                                                                    padding='none'
                                                                >
                                                                    {score.date}
                                                                </TableCell>
                                                                <TableCell
                                                                    padding='none'
                                                                    onClick={() => deleteScore(score.id).then()}
                                                                >
                                                                    <DeleteForeverRoundedIcon />
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
