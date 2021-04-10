import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      ...theme.typography.overline,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
  }),
);

export default function Info() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {"1.0.0"}
    </div>
  );
}