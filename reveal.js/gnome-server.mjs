import { execSync, spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

import express from 'express';
const app = express();

app.use(express.json());

import cors from 'cors';
app.use(cors());

let lastKnownPosition;

function move(id, position) {
    if(position) {
        lastKnownPosition = position;
    }
    else {
        position = lastKnownPosition;
    }
    // const x = Math.ceil((SCREEN.w - TERM.w) / 2) + SCREEN.x;
    // const y = Math.ceil((SCREEN.h - TERM.h) / 2) + SCREEN.y;

    // const height = Math.ceil(290.16668701171875 * DEVICE_PIXEL_RATIO - MARGIN);
    // const width = Math.ceil(1450.8333740234375 * DEVICE_PIXEL_RATIO - MARGIN);
    // const x = Math.ceil(170.5833282470703 * DEVICE_PIXEL_RATIO + MARGIN / 2);
    // const y = Math.ceil(501.58331298828125 * DEVICE_PIXEL_RATIO + MARGIN / 2);

    const {x,y,width, height} = position;
    console.log(position);

    console.log(`wmctrl -ir ${id} -e 0,${x},${y},${width},${height}`)

    execSync(`wmctrl -ir ${id} -e 0,${x},${y},${width},${height}`);
    execSync(`wmctrl -ir ${id} -b remove,below`);
    execSync(`wmctrl -ir ${id} -b add,above`);
}

function getTerminalRef(){
    const list = execSync('wmctrl -l', { encoding: 'utf8' });
    const windows = list
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
            const [id, index, hostname, ...windowName] = line.split(/ +/);
            return { id, name: windowName.join(' ') };
        });
    return windows.find(({ name }) => name.startsWith('Tilix'));
}

app.post('/move-window', async (req, res) => {
    console.log('move window')

    let terminal = getTerminalRef();

    if(! terminal){
        await startTerminal();
        terminal = getTerminalRef();
    }

    move(terminal.id, req.body);

    const windowId = execSync(`xdotool search --onlyvisible --class "Tilix"`);
    execSync(`xdotool windowactivate ${windowId}`);

    res.sendStatus(200);
});

app.post('/show-window', async (req, res) => {
    console.log(`show window : ${req.body.windowName}`)

    try{
        execSync(`./streamdeck/show-window.sh ${req.body.windowName}`);
        if(req.body.windowName === "firefox"){
            // open url too
            execSync(`firefox ${req.body.url}`);
        }
        res.sendStatus(200);
    }
    catch (e){
        res.sendStatus(500);
    }
});

app.post('/hide-window', (req, res) => {
    console.log('hide window');

    // show presentation slides

    execSync(`./streamdeck/show-window.sh 'Présentation'`);

    res.sendStatus(200);
});

function type(command){
    execSync(`setxkbmap fr && xdotool type --clearmodifiers --delay 100  '${command}'`);
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

app.post('/type', (req, res) => {
    console.log('type : ' + req.body.type);

    // show shell window
    execSync(`./streamdeck/show-window.sh 'Tilix'`);

    type(req.body.type);

    res.sendStatus(200);
});

app.listen(7000, () => {
    console.log(`gnome-server: listening on port ${7000}`);
});

