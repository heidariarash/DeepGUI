const {ipcRenderer} = require('electron');
let layer;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('done').addEventListener('click', ()=> {
    layer.type = document.getElementById("activation-selector").value;
    ipcRenderer.send("layer-config-finish", layer);
});

ipcRenderer.on("layer-config", (event , layer_config) => {
    layer = layer_config;
    document.getElementById("activation-selector").value = layer_config.type;
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();