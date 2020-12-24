const {ipcRenderer} = require('electron');
let layer;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('done').addEventListener('click', ()=> {
    let complete = true;
    if(document.getElementById("input-dimension").value == "")  { complete = false}
    if(document.getElementById("output-dimension").value == "") { complete = false}
    try{
        if(document.getElementById("input-length").value == "") { complete = false}
    }
    catch(err) {}
    if( complete === false){
        return;
    }
    layer.input_dim  = document.getElementById("input-dimension").value;
    layer.output_dim = document.getElementById("output-dimension").value;
    try{
        layer.input_length = document.getElementById("input-length").value;
    }
    catch (err){

    }
    ipcRenderer.send("layer-config-finish", layer);
});

ipcRenderer.on("layer-config", (event , arg) => {
    layer = arg.layer
    document.getElementById("input-dimension").value  = layer.input_dim;
    document.getElementById("output-dimension").value = layer.output_dim;
    if (arg.framework == "PyTorch"){
        ipcRenderer.send('resize-small', -1);
        const input_len = document.getElementById("input-length");
        input_len.parentNode.removeChild(input_len.previousSibling);
        input_len.parentNode.removeChild(input_len.previousSibling);
        input_len.parentNode.removeChild(input_len.previousSibling);
        input_len.parentNode.removeChild(input_len.previousSibling);
        input_len.parentNode.removeChild(input_len);
    }
    else {
        document.getElementById("input-length").value = layer.input_length;
    }
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();