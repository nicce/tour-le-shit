import React from 'react';
import ReactDOM from 'react-dom';
import Scoreboard  from './components/scoreboard/Scoreboard';
import ButtonAppBar from "./components/appbar/AppBar";
import Info from './components/info/Info';

ReactDOM.render(
    <React.StrictMode>
        <ButtonAppBar />
        <Scoreboard />
        <Info/>
    </React.StrictMode>,
    document.getElementById('root')
);
