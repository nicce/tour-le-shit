import React, { useState } from 'react';
import { SubmitScorecard } from '../../services/ScoreboardService';
import useSound from 'use-sound';
import { Button, Dialog, DialogContent, TextField, MenuItem, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import currentSeason from '../season';

type Scorecard = {
    name: string;
    points: number;
    holderOfSnek: boolean;
    nettoTweets: number;
    nettoEagles: number;
    muligans: number;
    season: number;
};

export function ScorecardForm(props: { updateState: () => Promise<void>; season: number }) {
    const [name, setName] = useState('');
    const [snek, setSnek] = useState('');
    const [stablefordPoints, setStablefordPoints] = useState('0');
    const [nettoTweets, setNettoTweets] = useState('0');
    const [nettoEagles, setNettoEagles] = useState('0');
    const [muligans, setMuligans] = useState('0');
    const [open, setOpen] = useState(false);
    const [playSnek] = useSound('./snek.mp3', { volume: 0.25 });
    const validData: { [key: string]: string } = {
        name: '.+',
        points: '^[0-9]\\d*$',
        snek: 'true|false|',
        nettoTweets: '^[0-9]\\d*$',
        nettoEagles: '^[0-9]\\d*$',
        muligans: '^[0-9]\\d*$',
    };
    const names = [
        {
            value: 'Niclas',
            label: 'Niclas',
        },
        {
            value: 'Johan',
            label: 'Johan',
        },
        {
            value: 'Alexander',
            label: 'Alexander',
        },
        {
            value: 'Viktor',
            label: 'Viktor',
        },
        {
            value: 'Marcus',
            label: 'Marcus',
        },
    ];

    const sneks = [
        {
            value: 'true',
            label: 'Yes',
        },
        {
            value: 'false',
            label: 'No',
        },
    ];
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const scorecard: Scorecard = {
            name: name,
            holderOfSnek: snek === 'true' ? true : false,
            points: +stablefordPoints,
            nettoTweets: +nettoTweets,
            nettoEagles: +nettoEagles,
            muligans: +muligans,
            season: props.season,
        };
        if (scorecard.holderOfSnek) {
            playSnek();
        }
        await SubmitScorecard(JSON.stringify(scorecard));
        await props.updateState();
        setOpen(false);
    };

    const isValid = (fieldName: string): boolean => {
        const regex = new RegExp(validData[fieldName]);
        switch (fieldName) {
            case 'name':
                return regex.test(name);
            case 'snek':
                return regex.test(snek);
            case 'points':
                return regex.test(stablefordPoints);
            case 'nettoTweets':
                return regex.test(nettoTweets);
            case 'nettoEagles':
                return regex.test(nettoEagles);
            case 'muligans':
                return regex.test(muligans);
        }

        return true;
    };

    const isFormValid = (): boolean => {
        const fields = ['name', 'snek', 'points', 'nettoTweets', 'nettoEagles', 'muligans'];
        for (let field of fields) {
            if (!isValid(field)) {
                return false;
            }
        }
        return true;
    };

    return (
        <>
            <Button disabled={currentSeason !== props.season} color='inherit' onClick={handleClickOpen}>
                <AddIcon />
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogContent>
                    <form>
                        <TextField
                            required={true}
                            error={!isValid('name')}
                            autoFocus
                            margin='dense'
                            id='name'
                            select
                            label='Name &#128169;'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        >
                            {names.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            error={!isValid('points')}
                            margin='dense'
                            id='points'
                            label='Stableford points'
                            type='number'
                            onChange={(e) => setStablefordPoints(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            error={!isValid('snek')}
                            margin='dense'
                            id='holderOfTheSnake'
                            select
                            label='Snek?'
                            value={snek}
                            onChange={(e) => setSnek(e.target.value)}
                            fullWidth
                        >
                            {sneks.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            error={!isValid('nettoTweets')}
                            margin='dense'
                            id='nettoTweets'
                            label='Birdies'
                            type='number'
                            onChange={(e) => setNettoTweets(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            error={!isValid('nettoEagles')}
                            margin='dense'
                            id='nettoEagles'
                            label='Eagles'
                            type='number'
                            onChange={(e) => setNettoEagles(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            error={!isValid('muligans')}
                            margin='dense'
                            id='muligans'
                            label='Muligans'
                            type='number'
                            onChange={(e) => setMuligans(e.target.value)}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='secondary'>
                        Cancel
                    </Button>
                    <Button disabled={!isFormValid()} onClick={handleSubmit} color='primary'>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
