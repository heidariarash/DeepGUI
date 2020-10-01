const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('exit-app');
});

document.getElementById('min-btn').addEventListener('click', () => {
    ipcRenderer.send('exit-app');
});

document.getElementById('max-btn').addEventListener('click', () => {
    ipcRenderer.send('exit-app');
});