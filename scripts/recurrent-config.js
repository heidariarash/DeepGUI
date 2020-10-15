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
    layer.units = document.getElementById("number-of-units").value;
    layer.activation = document.getElementById("activation-selector").value;
    if (document.getElementById("re_activation-selector")){
        layer.re_activation = document.getElementById("re_activation-selector").value;
    }
    layer.return_sequence = document.getElementById("ret-seq").checked;
    ipcRenderer.send("layer-config-finish", layer);
});

ipcRenderer.on("layer-config", (event , layer_config) => {
    layer = layer_config;
    if(layer_config.re_activation){
        document.getElementById("re_activation-selector").value = layer_config.re_activation;
    }
    else {
        let removeable = document.getElementById("re_activation-selector");
        removeable.parentNode.removeChild(removeable.previousElementSibling);
        removeable.parentNode.removeChild(removeable.previousElementSibling);
        removeable.parentNode.removeChild(removeable.nextElementSibling);
        removeable.parentNode.removeChild(removeable.nextElementSibling);
        removeable.parentNode.removeChild(removeable);
        document.getElementsByClassName('scrollable')[0].appendChild(document.createElement('br'));
        document.getElementsByClassName('scrollable')[0].appendChild(document.createElement('br'));
    }
    document.getElementById("number-of-units").value = layer_config.units;
    document.getElementById("activation-selector").value = layer_config.activation;
    document.getElementById("ret-seq").checked = layer_config.return_sequence;
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();