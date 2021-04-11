import React from 'react';
import Scoreboard from './components/scoreboard/Scoreboard';
import ButtonAppBar from './components/appbar/AppBar';
import Info from './components/info/Info';

export default function App() {
    return (
        <React.StrictMode>
            <ButtonAppBar />
            <Scoreboard />
            <Info />
        </React.StrictMode>
    );
}
