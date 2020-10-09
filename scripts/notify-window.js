const {ipcRenderer} = require('electron');

document.getElementById('ok').addEventListener('click', () => {
    ipcRenderer.send('close-notify');
});