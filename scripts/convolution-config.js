const {ipcRenderer} = require('electron');
let layer;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
    console.log("here");
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
    ipcRenderer.send("layer-config-finish", layer);
});

ipcRenderer.on("layer-config", (event , layer_config) => {
    if(layer_config.filter_size.length === 3){
        document.getElementsByClassName("small-input")[0].value = layer_config.filter_size[0];
        document.getElementsByClassName("small-input")[1].value = layer_config.filter_size[1];
        document.getElementsByClassName("small-input")[2].value = layer_config.filter_size[2];
    }
    else if(layer_config.filter_size.length === 2){
        document.getElementsByClassName("small-input")[0].value = layer_config.filter_size[0];
        document.getElementsByClassName("small-input")[1].value = layer_config.filter_size[1];
        document.getElementsByClassName("small-input")[2].parentNode.removeChild(document.getElementsByClassName("small-input")[2]);
    }
    else {
        document.getElementsByClassName("small-input")[0].value = layer_config.filter_size;
        document.getElementsByClassName("small-input")[2].parentNode.removeChild(document.getElementsByClassName("small-input")[2]);
        document.getElementsByClassName("small-input")[1].parentNode.removeChild(document.getElementsByClassName("small-input")[1]);
    }
    document.getElementById("number-of-filters").value = layer_config.filter_num;
    document.getElementById("stride").value = layer_config.stride;
    document.getElementById("activation-selector").value = layer_config.activation;
    document.getElementById("padding-selector").value = layer_config.padding;
    layer = layer_config;
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();