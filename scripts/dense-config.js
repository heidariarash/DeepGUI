const {ipcRenderer} = require('electron');
let layer;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('done').addEventListener('click', ()=> {
    let complete = true;
    if(document.getElementById("number-of-units").value == "") { complete = false}
    if( complete === false){
        return;
    }
    layer.unit_num = document.getElementById("number-of-units").value;
    layer.activation = document.getElementById("activation-selector").value;
    ipcRenderer.send("layer-config-finish", layer);
});

ipcRenderer.on("layer-config", (event , layer_config) => {
    document.getElementById("number-of-units").value = layer_config.unit_num;
    document.getElementById("activation-selector").value = layer_config.activation;
    layer = layer_config;
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();