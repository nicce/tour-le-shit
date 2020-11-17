import React, {Component} from 'react';
import { GetScoreboard } from '../../services/ScoreboardService';
import {TableContainer} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";

interface Player {
    name: string;
    points: number;
    lastPlayed: string;
}

class Scoreboard extends Component {

    state = {
        scoreboard: [],
    }

    componentDidMount() {
        GetScoreboard().then(res => {
            console.log(res);
            this.setState({scoreboard: res});
        });
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
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
                            <TableRow key={player.name}>
                                <TableCell>{player.name}</TableCell>
                                <TableCell component="th" scope="row">
                                    {player.points}
                                </TableCell>
                                <TableCell>{player.lastPlayed}</TableCell>
                                <TableCell>&#128013;</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default Scoreboard;
