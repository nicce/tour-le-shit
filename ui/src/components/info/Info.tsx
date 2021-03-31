import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: '80%',
    marginTop: '10%',
    
  },
});

export default function Info() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h5" component="h2" >
            2021 Season
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div">
            Congratulations to Alexander for being the preseason champion.
            <br/>
            The 2021 season will offically star, with a friendly scramble at <mark>2021-04-04: 09:35:00</mark>, on Classic Course.
          </Typography>
          <br/>
          <Typography variant="h5" component="h2" >
            Point calculation
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div">
            Points are calculated based on four things:
            <ul>
                <li>Your score</li>
                <li>Number of netto birdies</li>
                <li>Number of netto eagles</li>
                <li>Number of muligans</li>
            </ul>
            Your <mark>base point</mark> is calculated based on your <mark>(score - 36 x 2)</mark>, but can never get a base point lover than -6.
            <br/>
            For example, if you score 38 one round, your base point will be 4. If you score 29 your base point will be -6.
            <br/>
            You can then get additional points by scoring netto birdies and netto eagles. 
            <br/>
            A <mark>netto birdie</mark> gives you <mark>2 points</mark>, 
            while a <mark>netto eagle</mark> gives you <mark>3 points</mark>. 
            <br/> 
            But be aware, the <mark>muligans</mark> give you <mark>-2 points each</mark>
            <br/>
            Why the snek you ask?
            <br/>
            Well that's just for fun!
          </Typography>
        </CardContent>
      </CardActionArea>
      <div>v1.0.0</div>
    </Card>
  );
}