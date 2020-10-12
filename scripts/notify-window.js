const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('ok').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});