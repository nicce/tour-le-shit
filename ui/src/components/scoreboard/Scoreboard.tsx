import React, {Component} from 'react';
import { GetPlayerScores, GetScoreboard } from '../../services/ScoreboardService';
import {TableContainer} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


interface Player {
    name: string;
    points: number;
    lastPlayed: string;
    holderOfSnek: boolean;
}

interface Score {
    name: string;
    points: number;
    holderOfSnek: boolean;
    nettoTweets: number;
    nettoEagles: number;
    muligans: number;
    date: string
}

class Scoreboard extends Component {
    
    state = {
        scoreboard: [],
        scores: new Map(),
        open: new Map(),
    }

    setOpen(name: string) {
        const isOpen = this.state.open.get(name);
        this.state.open.set(name, !isOpen);
        this.setState({open: this.state.open})
    }

    componentDidMount() {
        let openState = new Map()
        GetScoreboard().then(res => {
            let scoresState = new Map();
            res.forEach( (player: Player) => {
                openState.set(player.name, false);
                GetPlayerScores(player.name).then(scores => {
                    scoresState.set(player.name, scores);
                })
                
            });
            this.setState({scoreboard: res, scores: scoresState, open: openState});
        });
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Last played</TableCell>
                            <TableCell>Snek</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.scoreboard.map((player: Player) => (
                            <React.Fragment>
                                <TableRow key={player.name}>
                                    <TableCell onClick={() => this.setOpen(player.name)}>{player.name}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {player.points}
                                    </TableCell>
                                    <TableCell>{player.lastPlayed}</TableCell>
                                    <TableCell>{player.holderOfSnek ? String.fromCodePoint(0X1F40D) : ''}</TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                <Collapse in={this.state.open.get(player.name)} timeout="auto" unmountOnExit>
                                    <Box margin={0}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        History
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>{String.fromCodePoint(0X1F4C5)}</TableCell>
                                            <TableCell>{String.fromCodePoint(0X1F3CC)}</TableCell>
                                            <TableCell>{String.fromCodePoint(0X1F426)}</TableCell>
                                            <TableCell>{String.fromCodePoint(0X1F985)}</TableCell>
                                            <TableCell>{String.fromCodePoint(0X1F40D)}</TableCell>
                                            <TableCell>{String.fromCodePoint(0X1F373)}</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        {this.state.scores.get(player.name) ? 
                                        <TableBody>
                                        {this.state.scores.get(player.name).map((score: Score) => (
                                            <TableRow key={score.date}>
                                                <TableCell component="th" scope="row">{score.date}</TableCell>
                                                <TableCell>{score.points}</TableCell>
                                                <TableCell>{score.nettoTweets}</TableCell>
                                                <TableCell>{score.nettoEagles}</TableCell>
                                                <TableCell>{score.holderOfSnek ? String.fromCodePoint(0X1F40D) : ''}</TableCell>
                                                <TableCell>{score.muligans}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                        : <TableBody></TableBody>}
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
