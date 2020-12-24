const {ipcRenderer} = require('electron');
let config;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('done').addEventListener('click', ()=> {
    let complete = true;
    for(let i = 0; i < document.getElementsByClassName("small-input").length; i++){
        if(document.getElementsByClassName("small-input")[i].value == "" || document.getElementsByClassName("small-input")[i].value < 1) { complete = false}
    }
    if( complete === false){
        return;
    }
    config.model      = document.getElementById("model-selector").value;
    config.top_layer  = document.getElementById("top-layer").checked;
    config.pretrained = document.getElementById("pretrained").checked;
    config.trainable  = document.getElementById("trainable").checked;
    config.shape[0]   = document.getElementsByClassName('small-input')[0].value;
    config.shape[1]   = document.getElementsByClassName('small-input')[1].value;
    config.shape[2]   = document.getElementsByClassName('small-input')[2].value;
    ipcRenderer.send("set-transfer-learning", config);
});

ipcRenderer.on("initialize", (event , arg) => {
    document.getElementById("model-selector").value         = arg.model;
    document.getElementsByClassName('small-input')[0].value = arg.shape[0];
    document.getElementsByClassName('small-input')[1].value = arg.shape[1];
    document.getElementsByClassName('small-input')[2].value = arg.shape[2];
    document.getElementById("pretrained").checked           = arg.pretrained;
    document.getElementById("top-layer").checked            = arg.top_layer;
    document.getElementById("trainable").checked            = arg.trainable;
    config = arg;
});

(function() {
    ipcRenderer.send('ready-tl-config');
 })();