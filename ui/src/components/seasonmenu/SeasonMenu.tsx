import { Button } from '@mui/material';
import React, { Dispatch } from 'react';
import { SetStateAction } from 'react-transition-group/node_modules/@types/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export function SeasonMenu(props: { setSeason: Dispatch<SetStateAction<number>>; season: number }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChoice = (season: number) => {
        setAnchorEl(null);
        props.setSeason(season);
    };
    return (
        <>
            <Button
                id='season-button'
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                style={{ color: '#FFFFFF' }}
            >
                s{props.season}
            </Button>
            <Menu
                id='basic-menu'
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'season-button',
                }}
            >
                <MenuItem onClick={() => handleChoice(1)}>S1</MenuItem>
                <MenuItem onClick={() => handleChoice(2)}>S2</MenuItem>
            </Menu>
        </>
    );
}
