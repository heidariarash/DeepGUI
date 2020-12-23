const {ipcRenderer} = require('electron');
let config;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('done').addEventListener('click', ()=> {
    let complete = true;
    for(let i = 0; i < document.getElementsByClassName("small-input").length; i++){
        if(document.getElementsByClassName("small-input")[i].value == ""){ complete = false}
    }
    if(document.getElementById("number-of-filters").value == "") { complete = false}
    if(document.getElementById("stride").value == "") { complete = false}
    if( complete === false){
        return;
    }
    if (document.getElementsByClassName("small-input").length === 1) {layer.filter_size = document.getElementsByClassName("small-input")[0].value}
    else {
        for(let i = 0; i < document.getElementsByClassName("small-input").length; i++){
            layer.filter_size[i] = document.getElementsByClassName("small-input")[i].value;
        }
    }
    layer.filter_num = document.getElementById("number-of-filters").value;
    layer.stride = document.getElementById("stride").value;
    layer.activation = document.getElementById("activation-selector").value;
    layer.padding = document.getElementById("padding-selector").value;
});

ipcRenderer.on("initialize", (event , arg) => {
    document.getElementById("model-selector").value = arg.model;
    document.getElementsByClassName('small-input')[0].value = arg.shape[0];
    document.getElementsByClassName('small-input')[1].value = arg.shape[1];
    document.getElementsByClassName('small-input')[2].value = arg.shape[2];
    document.getElementById("pretrained").checked = arg.pretrained;
    document.getElementById("top-layer").checked = arg.top_layer;
    document.getElementById("trainable").checked = arg.trainable;
    config = arg;
});

(function() {
    ipcRenderer.send('ready-tl-config');
 })();