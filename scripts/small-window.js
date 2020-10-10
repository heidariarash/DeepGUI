const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('done').addEventListener('click', () => {
    ipcRenderer.send('add-new-layer', document.getElementById('layer-selector').value);
});

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('ok').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

