import { execSync, spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

import express from 'express';
const app = express();

app.use(express.json());

import cors from 'cors';
app.use(cors());

function move(id, position) {

    // const x = Math.ceil((SCREEN.w - TERM.w) / 2) + SCREEN.x;
    // const y = Math.ceil((SCREEN.h - TERM.h) / 2) + SCREEN.y;

    // const height = Math.ceil(290.16668701171875 * DEVICE_PIXEL_RATIO - MARGIN);
    // const width = Math.ceil(1450.8333740234375 * DEVICE_PIXEL_RATIO - MARGIN);
    // const x = Math.ceil(170.5833282470703 * DEVICE_PIXEL_RATIO + MARGIN / 2);
    // const y = Math.ceil(501.58331298828125 * DEVICE_PIXEL_RATIO + MARGIN / 2);

    const {x,y,width, height} = position;
    console.log(position);

    execSync(`wmctrl -ir ${id} -e 0,${x},${y},${width},${height}`);
    execSync(`wmctrl -ir ${id} -b remove,below`);
    execSync(`wmctrl -ir ${id} -b add,above`);
}

app.post('/move-window', (req, res) => {
    console.log('move window')
    const list = execSync('wmctrl -l', { encoding: 'utf8' });
    const windows = list
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
            const [id, index, hostname, ...windowName] = line.split(/ +/);
            return { id, name: windowName.join(' ') };
        });
    const terminal = windows.find(({ name }) => name.startsWith('Tilix'));
    move(terminal.id, req.body);

    const windowId = execSync(`xdotool search --onlyvisible --limit 1 --class "Tilix"`);
    execSync(`xdotool windowactivate ${windowId}`);

    res.sendStatus(200);
});

app.post('/hide-window', (req, res) => {
    console.log('hide window')
    const list = execSync('wmctrl -l', { encoding: 'utf8' });
    const windows = list
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
            const [id, index, hostname, ...windowName] = line.split(/ +/);
            return { id, name: windowName.join(' ') };
        });
    const terminal = windows.find(({ name }) => name.startsWith('Tilix'));
    execSync(`wmctrl -ir ${terminal.id} -b add,below`);

    const windowId = execSync(`xdotool search --onlyvisible --limit 1 --class "Firefox"`);
    execSync(`xdotool windowactivate ${windowId}`);
    res.sendStatus(200);
});

function type(command){
    console.log('type : ' + command);
    const windowId = execSync(`xdotool search --onlyvisible --limit 1 --class "Tilix"`);
    execSync(`xdotool windowactivate ${windowId}`);
    execSync(`setxkbmap fr && xdotool type --delay 100  "${command}"`);
}

app.post('/type', (req, res) => {
    type(req.body.type);
    res.sendStatus(200);
});

app.listen(7000, () => {
    console.log(`helloworld: listening on port ${7000}`);
});


const terminalProcess = spawn('tilix');
await setTimeout(1500);

type("cd ~/workspaces/sunny-tech/buildpacks-talk/spring-petclinic\n");
type("clear\n");

console.log({
    terminal: terminalProcess.pid,
});

process.on('SIGINT', function () {
    try {
        terminalProcess.kill();
    }
    catch (e) {
        console.log(e);
    }
});

const gnomeWindows = [
    { id: 'terminal', pid: terminalProcess.pid },
];

export default {
    port: 8080,
    hostname: '0.0.0.0',
    nodeResolve: true,
    watch: true,
};