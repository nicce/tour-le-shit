import React from 'react';
import ButtonAppBar from './components/appbar/AppBar';
import Info from './components/info/Info';

export default function App() {
    return (
        <React.StrictMode>
            <ButtonAppBar />
            <Info />
        </React.StrictMode>
    );
}
