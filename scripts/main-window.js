const electron = require('electron');
const {ipcRenderer} = electron;
const add_layer_to_window = require("../scripts/utils/new-layer.js");
const change_desc = require("../scripts/utils/change-desc.js");

let layers = [];
let layers_count = 0;

const delete_layer = (element) => {
    for (let i=0; i < layers.length; i++) {
        if (layers[i].id === element.id.slice(0,-6)) {
            layers.splice(i, 1);
            layer_to_remove = document.getElementById(element.id.slice(0,-6));
            layer_to_remove.parentNode.removeChild(layer_to_remove);
            break;
        }
    }
}

const layer_config = element => {
    for (let i=0; i < layers.length; i++) {
        if (layers[i].id === element.id.slice(0,-4)) {
            ipcRenderer.send("config-layer", layers[i])
            break;
        }
    }
}

const remove_attention = element => {
    if(element.id === "optimizer-lr"){
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
    }
    else if(element.id === "batch") {
        document.getElementById('batch-attention').setAttribute('style','opacity: 0');
    }
    else if(element.id === "epoch") {
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
    }
}

const check_and_generate = () => {
    if(document.getElementById('optimizer-lr').value <= 0){
        document.getElementById('lr-attention').setAttribute('style','opacity: 1');
    }
    else if(document.getElementById('epoch').value < 1){
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 1');
    }
    else if(document.getElementById('batch').value < 1){
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
        document.getElementById('batch-attention').setAttribute('style','opacity: 1');
    }
    else if(document.getElementById('file-name-input').value == ""){
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
        document.getElementById('batch-attention').setAttribute('style','opacity: 0');
        document.getElementById('name-attention').setAttribute('style','opacity: 1');
    }
    else if(layers.length === 0) {
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
        document.getElementById('batch-attention').setAttribute('style','opacity: 0');
        document.getElementById('name-attention').setAttribute('style','opacity: 0');
        document.getElementById('layer-attention').setAttribute('style','opacity: 1');
    }
    else {
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
        document.getElementById('batch-attention').setAttribute('style','opacity: 0');
        document.getElementById('name-attention').setAttribute('style','opacity: 0');
        document.getElementById('layer-attention').setAttribute('style','opacity: 0');
        ipcRenderer.send('generate-code', {
            framework: document.getElementById('framework-selector').value,
            optimizer: document.getElementById('optimizer-selector').value,
            lr: document.getElementById('optimizer-lr').value,
            loss: document.getElementById('loss-function-selector').value,
            epoch: document.getElementById('epoch').value,
            batch: document.getElementById('batch').value,
            layers: layers,
            file_name: document.getElementById('file-name-input').value
        });
    }
}

document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('exit-app');
});

document.getElementById('min-btn').addEventListener('click', () => {
    ipcRenderer.send('min-app');
});

document.getElementById('max-btn').addEventListener('click', () => {
    ipcRenderer.send('max-app');
});

document.getElementById('new-layer-button').addEventListener('click', () => {
    ipcRenderer.send('new-layer-request');
});

document.getElementById('generate-button').addEventListener('click', () => {
    check_and_generate();
});

document.getElementById("framework-selector").addEventListener('change', () => {
    if(document.getElementById("framework-selector").value === "PyTorch"){
        document.getElementById('framework-attention').setAttribute('style','opacity: 1');
        document.getElementById('generate-button').style.display = "none";
    }
    else {
        document.getElementById('framework-attention').setAttribute('style','opacity: 0');
        document.getElementById('generate-button').style.display = "inline-block";
    }
});

document.getElementById('input-shape-cog').addEventListener('click', () => {
    ipcRenderer.send('input-shape-cog');
});

ipcRenderer.on('add-new-layer', (event, args) => {
    add_layer_to_window(args, layers_count);
    layers_count += 1;
    document.getElementById('layer-attention').setAttribute('style','opacity: 0');
});

//setting input shape
ipcRenderer.on('set-input-shape', (event, arg) => {
    let shape = "";
    for (dim of arg){
        shape += `${dim}, `;
    }
    shape = shape.slice(0,-2);
    document.getElementById('input-shape-text').innerHTML = shape;
})

//getting configurations
ipcRenderer.on('set-config', (event, layer) => {
    let filter_size = ""
    for (let i=0; i < layers.length; i++) {
        if (layers[i].id === layer.id) {
            layers[i] = layer;
            change_desc(layer);
            break;
        }
    }
})