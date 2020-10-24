const {ipcRenderer} = require('electron');
let layer;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('done').addEventListener('click', ()=> {
    let complete = true;
    if(document.getElementById("hidden-size").value == "") { complete = false}
    if( complete === false){
        return;
    }
    layer.hid_size = document.getElementById("hidden-size").value;
    ipcRenderer.send("layer-config-finish", layer);
});

ipcRenderer.on("layer-config", (event , arg) => {
    layer_config = arg.layer;
    layer = layer_config;
    document.getElementById("hidden-size").value = layer_config.hid_size;
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();