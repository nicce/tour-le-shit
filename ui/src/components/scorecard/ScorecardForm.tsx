import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';


export function ScorecardForm() {
  const [name, setName] = React.useState('');
  const [snek, setSnek] = React.useState('')
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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSnekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSnek(event.target.value);
  };

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

  const handleSubmit = () => {
    
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
          <TextField
            autoFocus
            margin="dense"
            id="name"
            select
            label="Name &#128169;"
            value={name}
            onChange={handleNameChange}
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
            fullWidth
          />
          <TextField
            margin="dense"
            id="holderOfTheSnake"
            select
            label="Snek?"
            value={snek}
            onChange={handleSnekChange}
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
            fullWidth
          />
          <TextField
            margin="dense"
            id="nettoEagles"
            label="Netto Eagle"
            type="number"
            fullWidth
          />
          <TextField
            margin="dense"
            id="muligans"
            label="Muligans"
            type="number"
            fullWidth
          />
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