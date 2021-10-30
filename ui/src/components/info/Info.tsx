import React from 'react';
import { useTheme } from '@mui/styles';
import { Typography } from '@mui/material';

export default function Info() {
    const theme = useTheme();

    return (
        <Typography
            component='p'
            color='secondary'
            style={{ paddingTop: theme.spacing(2), margin: 'auto', maxWidth: '600px' }}
        >
            v{'1.2.1'}
        </Typography>
    );
}
