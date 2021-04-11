import { Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import React from 'react';

export function Refresh() {
    const reload = () => {
        window.location.reload();
    };
    return (
        <div>
            <Button color='inherit' onClick={reload}>
                <RefreshIcon fontSize='inherit' />
            </Button>
        </div>
    );
}
