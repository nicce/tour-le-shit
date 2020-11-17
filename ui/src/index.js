import React from 'react';
import ReactDOM from 'react-dom';
import Scoreboard  from './components/scoreboard/Scoreboard';
import ButtonAppBar from "./components/appbar/AppBar";

ReactDOM.render(
    <React.StrictMode>
        <ButtonAppBar />
        <Scoreboard />
    </React.StrictMode>,
    document.getElementById('root')
);
