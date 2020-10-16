const electron = require('electron');
const {ipcRenderer} = electron;
const add_layer_to_window = require("../scripts/new-layer.js");

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

document.getElementById('input-shape-cog').addEventListener('click', () => {
    ipcRenderer.send('input-shape-cog');
});

ipcRenderer.on('add-new-layer', (event, args) => {
    add_layer_to_window(args, layers_count);
    layers_count += 1;
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
            configed_layer = document.getElementById(layer.id);
            switch(layer.name){
                case "Convolution 1D":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of filters: ${layer.filter_num}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Filter Size: ${layer.filter_size}`;
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Stride: ${layer.stride}`;
                    configed_layer.getElementsByTagName("p")[3].innerHTML = `Activation: ${layer.activation}`;
                    configed_layer.getElementsByTagName("p")[4].innerHTML = `Padding: ${layer.padding}`;
                    break;
                case "Convolution 2D":
                case "Convolution 3D":
                    for(size of layer.filter_size){
                        filter_size += `${size},`;
                    }
                    filter_size = filter_size.slice(0,-1);
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Filter Size: ${filter_size}`;
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of filters: ${layer.filter_num}`;
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Stride: ${layer.stride}`;
                    configed_layer.getElementsByTagName("p")[3].innerHTML = `Activation: ${layer.activation}`;
                    configed_layer.getElementsByTagName("p")[4].innerHTML = `Padding: ${layer.padding}`;
                    break;
                case "Avg Pool 1D":
                case "Max Pool 1D":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Filter Size: ${layer.filter_size}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Stride: ${layer.stride}`;
                    break;
                case "Avg Pool 2D":
                case "Avg Pool 3D":
                case "Max Pool 2D":
                case "Max Pool 3D":
                    for(size of layer.filter_size){
                        filter_size += `${size},`;
                    }
                    filter_size = filter_size.slice(0,-1);
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Filter Size: ${filter_size}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Stride: ${layer.stride}`;
                    break;
                case "LSTM":
                case "GRU":
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Recurrent Activation: ${layer.re_activation}`;
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of Units: ${layer.units}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Activation: ${layer.activation}`;
                    configed_layer.getElementsByTagName("p")[3].innerHTML = `Return Sequence: ${layer.return_sequence?'True':'False'}`;
                    break;
                case "RNN":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of Units: ${layer.units}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Activation: ${layer.activation}`;
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Return Sequence: ${layer.return_sequence?'True':'False'}`;
                    break;
                case "Linear":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Number of Units: ${layer.unit_num}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Activation: ${layer.activation.split('_').join(' ')}`;
                    break;
                case "Embedding":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Input Dimension: ${layer.input_dim}`;
                    configed_layer.getElementsByTagName("p")[1].innerHTML = `Output Dimension: ${layer.output_dim}`;
                    configed_layer.getElementsByTagName("p")[2].innerHTML = `Input Length: ${layer.input_length}`;
                    break;
                case "Activation":
                    configed_layer.getElementsByTagName("p")[0].innerHTML = `Type: ${layer.type}`;
                    break;
            }
            break;
        }
    }
})