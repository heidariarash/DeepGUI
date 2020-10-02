const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('done').addEventListener('click', () => {
    ipcRenderer.send('add-new-layer');
});

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-new-layer');
});