const electron                                          = require('electron');
const {ipcRenderer}                                     = electron;
const add_layer_to_window                               = require("../scripts/utils/new-layer.js");
const change_desc                                       = require("../scripts/utils/change-desc.js");
const {change_losses, change_optimizers, change_layers} = require("../scripts/utils/change-framework-params.js");

let layers            = [];
let layers_count      = 0;
let framework         = "TensorFlow";
let transfer_learning = false;

const diagram = () => {
    return {
        framework: document.getElementById('framework-selector').value,
        optimizer: document.getElementById('optimizer-selector').value,
        lr:        parseInt(document.getElementById('optimizer-lr').value),
        loss:      document.getElementById('loss-function-selector').value,
        epoch:     parseInt(document.getElementById('epoch').value),
        batch:     parseInt(document.getElementById('batch').value),
        layers:    layers,
        tl_enable: transfer_learning
    }
}

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

const add_new_layer_buttons = element => {
    ipcRenderer.send('new-layer-request', element.id.slice(0,-4));
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
    else if(layers.length === 0) {
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
        document.getElementById('batch-attention').setAttribute('style','opacity: 0');
        document.getElementById('layer-attention').setAttribute('style','opacity: 1');
    }
    else {
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
        document.getElementById('batch-attention').setAttribute('style','opacity: 0');
        document.getElementById('layer-attention').setAttribute('style','opacity: 0');
        ipcRenderer.send('generate-code', diagram());
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
    add_new_layer_buttons({id: 'new-layer-button-parent-add'})
});

document.getElementById('generate-button').addEventListener('click', () => {
    check_and_generate();
});

document.getElementById('save-button').addEventListener('click', () => {
    ipcRenderer.send('save-diagram', diagram());
});

document.getElementById('load-button').addEventListener('click', () => {
    ipcRenderer.send('load-diagram');
});

document.getElementById("framework-selector").addEventListener('change', () => {
    ipcRenderer.send("change-framework", document.getElementById("framework-selector").value);
    framework = document.getElementById("framework-selector").value;
    if(document.getElementById("framework-selector").value === "PyTorch"){
        change_optimizers("PyTorch");
        change_losses("PyTorch");
        layers = change_layers("PyTorch", layers);
    }
    else {
        change_optimizers("TensorFlow");
        change_losses("TensorFlow");
        layers = change_layers("TensorFlow", layers);
    }
});

document.getElementById('input-shape-cog').addEventListener('click', () => {
    ipcRenderer.send('input-shape-cog');
});

document.getElementById('transfer-learning-cog').addEventListener('click', () => {
    ipcRenderer.send('transfer-learning-cog');
});

document.getElementById('transfer-learning').addEventListener('change', () => {
    transfer_learning = document.getElementById('transfer-learning').checked;
    if(transfer_learning){
        document.getElementById('input-shape-config').hidden              = true;
        document.getElementById('transfer-learning-config').style.display = 'block';
    }
    else{
        document.getElementById('input-shape-config').hidden              = false;
        document.getElementById('transfer-learning-config').style.display = 'none';
    }
});

ipcRenderer.on('add-new-layer', (event, args) => {
    add_layer_to_window(args, layers_count, framework);
    layers_count += 1;
    document.getElementById('layer-attention').setAttribute('style','opacity: 0');
});

//setting input shape
ipcRenderer.on('set-input-shape', (event, arg) => {
    let shape = "";
    for (dim of arg){
        shape += `${dim}, `;
    }
    shape                                                 = shape.slice(0,-2);
    document.getElementById('input-shape-text').innerHTML = shape;
})

//getting configurations
ipcRenderer.on('set-config', (event, layer) => {
    for (let i=0; i < layers.length; i++) {
        if (layers[i].id === layer.id) {
            layers[i] = layer;
            change_desc(layer, framework);
            break;
        }
    }
});

//cleaning the diagram
ipcRenderer.on("load-new-diagram", (event, arg) => {
    layers_count = 0;
    layers       = [];
    const diagram_layers = document.getElementsByClassName('layer-class');
    while(diagram_layers.length > 0){
        diagram_layers[0].parentNode.removeChild(diagram_layers[0]);
    }
    if (arg.framework !== framework){
        if(arg.framework === "PyTorch"){
            change_optimizers("PyTorch");
            change_losses("PyTorch");
        }
        else {
            change_optimizers("TensorFlow");
            change_losses("TensorFlow");
        }
    }
    document.getElementById("framework-selector").value     = arg.framework;
    document.getElementById('optimizer-lr').value           = arg.lr;
    document.getElementById('epoch').value                  = arg.epoch;
    document.getElementById('batch').value                  = arg.batch;
    document.getElementById('optimizer-selector').value     = arg.optimizer;
    document.getElementById('loss-function-selector').value = arg.loss;
});

//setting transfer learning text
ipcRenderer.on('set-transfer-learning', (event, arg) => {
    const shape                                                       = arg.shape[0] + ", " + arg.shape[1] + ", " + arg.shape[2];
    document.getElementById('transfer-learning-top-layer').innerHTML  = `Top Layer: ${arg.top_layer?'True':'False'}`;
    document.getElementById('transfer-learning-pretrained').innerHTML = `Pretrained Weights: ${arg.pretrained?'True':'False'}`;
    document.getElementById('transfer-learning-trainable').innerHTML  = `Trainble: ${arg.trainable?'True':'False'}`;
    document.getElementById('transfer-learning-model').innerHTML      = `Model: ${arg.model}`;
    if (framework === "TensorFlow"){
        document.getElementById('transfer-learning-shape').innerHTML      = `Input Shape: ${shape}`;
    }
});