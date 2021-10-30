import React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function Info() {
    const theme = useTheme();
    return (
        <Typography
            component='p'
            color='secondary'
            style={{ paddingTop: theme.spacing(2), margin: 'auto', maxWidth: '600px' }}
        >
            v2.0.1
        </Typography>
    );
}
