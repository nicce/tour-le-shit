import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ButtonAppBar from './components/appbar/AppBar';
import Info from './components/info/Info';
import theme from './theme';

export default function App() {
    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <ButtonAppBar />
                <Info />
            </ThemeProvider>
        </React.StrictMode>
    );
}
