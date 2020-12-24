const {ipcRenderer} = require('electron');
let layer;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('done').addEventListener('click', ()=> {
    let complete = true;
    if(document.getElementById("probability").value < 0 || document.getElementById("probability").value > 1) { complete = false}
    if(document.getElementById("probability").value == "")                                                   { complete = false}
    if( complete === false){
        return;
    }
    layer.prob = document.getElementById("probability").value;
    ipcRenderer.send("layer-config-finish", layer);
});

ipcRenderer.on("layer-config", (event , arg) => {
    layer = arg.layer;
    document.getElementById("probability").value = layer.prob;
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();