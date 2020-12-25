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
    config    = arg.transfer_learning;
    framework = arg.framework;
    console.log(framework)
    document.getElementById("model-selector").value         = config.model;
    document.getElementsByClassName('small-input')[0].value = config.shape[0];
    document.getElementsByClassName('small-input')[1].value = config.shape[1];
    document.getElementsByClassName('small-input')[2].value = config.shape[2];
    document.getElementById("pretrained").checked           = config.pretrained;
    document.getElementById("top-layer").checked            = config.top_layer;
    document.getElementById("trainable").checked            = config.trainable;
    
    if (framework === "PyTorch") {
        document.getElementById('model-selector').innerHTML = `
        <option value="alexnet">Alexnet</option>
        <option value="VGG 11">VGG 11</option>
        <option value="VGG 11 with Batch Normalization">VGG 11 with Batch Normalization</option>
        <option value="VGG 13">VGG 13</option>
        <option value="VGG 13 with Batch Normalization">VGG 13 with Batch Normalization</option>
        <option value="VGG 16">VGG 16</option>
        <option value="VGG 16 with Batch Normalization">VGG 16 with Batch Normalization</option>
        <option value="VGG 19">VGG 19</option>
        <option value="VGG 19 with Batch Normalization">VGG 19 with Batch Normalization</option>
        <option value="ResNet 18">ResNet 18</option>
        <option value="ResNet 34">ResNet 34</option>
        <option value="ResNet 50">ResNet 50</option>
        <option value="ResNet 101">ResNet 101</option>
        <option value="ResNet 152">ResNet 152</option>
        <option value="SqueezNet 1.0">SqueezNet 1.0</option>
        <option value="SqueezNet 1.1">SqueezNet 1.1</option>
        <option value="DenseNet 121">DenseNet 121</option>
        <option value="DenseNet 169">DenseNet 169</option>
        <option value="DenseNet 161">DenseNet 161</option>
        <option value="DenseNet 201">DenseNet 201</option>
        <option value="Inception V3">Inception V3</option>
        <option value="GoogLeNet">GoogLeNet</option>
        <option value="ShuffleNet V2 0.5x">ShuffleNet V2 0.5x</option>
        <option value="ShuffleNet V2 1.0x">ShuffleNet V2 1.0x</option>
        <option value="ShuffleNet V2 1.5x">ShuffleNet V2 1.5x</option>
        <option value="ShuffleNet V2 2.0x">ShuffleNet V2 2.0x</option>
        <option value="MobileNet V2">MobileNet V2</option>
        <option value="ResNeXt-50 32x4d">ResNeXt-50 32x4d</option>
        <option value="ResNeXt-101 32x8d">ResNeXt-101 32x8d</option>
        <option value="Wide ResNet-50-2">Wide ResNet-50-2</option>
        <option value="Wide ResNet-101-2">Wide ResNet-101-2</option>
        <option value="MNASNet 0.5">MNASNet 0.5</option>
        <option value="MNASNet 0.75">MNASNet 0.75</option>
        <option value="MNASNet 1.0">MNASNet 1.0</option>
        <option value="MNASNet 1.3">MNASNet 1.3</option>
        `
    }
});

(function() {
    ipcRenderer.send('ready-tl-config');
 })();