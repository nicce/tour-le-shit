import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import { SubmitScorecard } from '../../services/ScoreboardService';

type Scorecard = {
  name: string;
  points: number;
  holderOfSnek: boolean;
  nettoTweets: number;
  nettoEagles: number;
  muligans: number;
}

export function ScorecardForm() {
  const [name, setName] = React.useState('');
  const [snek, setSnek] = React.useState('');
  const [stablefordPoints, setStablefordPoints] = React.useState('');
  const [nettoTweets, setNettoTweets] = React.useState('');
  const [nettoEagles, setNettoEagles] = React.useState('');
  const [muligans, setMuligans] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const names = [
    {
      value: 'Niclas',
      label: 'Niclas'
    },
    {
      value: 'Johan',
      label: 'Johan'
    },
    {
      value: 'Alexander',
      label: 'Alexander'
    },
    {
      value: 'Viktor',
      label: 'Viktor'
    },
    {
      value: 'Marcus',
      label: 'Marcus'
    },
    {
      value: 'Gosesnosen',
      label: 'Gosesnosen'
    },
  ];

  const sneks = [
    {
      value: 'true',
      label: 'Yes'
    },
    {
      value: 'false',
      label: 'No'
    }
  ]
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const scorecard: Scorecard = {
      name: name,
      holderOfSnek: snek === 'true' ? true : false,
      points: +stablefordPoints,
      nettoTweets: +nettoTweets,
      nettoEagles: +nettoEagles,
      muligans: +muligans
    }
    SubmitScorecard(JSON.stringify(scorecard));
    setOpen(false); 
  }
  

  return (
    <div>
      <Button variant="outlined" color="inherit" onClick={handleClickOpen}>
        +
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add score</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please post your scorecard from your tour-le-shit round. We expect it went &#128169;
            except if your name is Alexander.
          </DialogContentText>
          <form>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              select
              label="Name &#128169;"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
            >
              {names.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            </TextField>
            <TextField
              margin="dense"
              id="points"
              label="Stableford points"
              type="number"
              onChange={e => setStablefordPoints(e.target.value)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="holderOfTheSnake"
              select
              label="Snek?"
              value={snek}
              onChange={e => setSnek(e.target.value)}
              fullWidth
            >
              {sneks.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
            </TextField>
            <TextField
              margin="dense"
              id="nettoTweets"
              label="Netto Birdies"
              type="number"
              onChange={e => setNettoTweets(e.target.value)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="nettoEagles"
              label="Netto Eagle"
              type="number"
              onChange={e => setNettoEagles(e.target.value)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="muligans"
              label="Muligans"
              type="number"
              onChange={e => setMuligans(e.target.value)}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}