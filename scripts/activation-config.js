const {ipcRenderer} = require('electron');
let layer;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('done').addEventListener('click', ()=> {
    layer.type = document.getElementById("activation-selector").value;
    ipcRenderer.send("layer-config-finish", layer);
});

ipcRenderer.on("layer-config", (event , arg) => {
    layer_config = arg.layer;
    layer = layer_config;
    if(arg.framework === "PyTorch"){
        document.getElementById('activation-selector').innerHTML = `
        <option value="CELU">Celu</option>
        <option value="ELU">Elu</option>
        <option value="GELU">Gelu</option>
        <option value="Hardshrink">Hard Shrink</option>
        <option value="Hardsigmoid">Hard Sigmoid</option>
        <option value="Hardtanh">Hard Tanh</option>
        <option value="Hardswish">Hard Swish</option>
        <option value="LeakyReLU">Leaky ReLU</option>
        <option value="LogSigmoid">Log Sigmoid</option>
        <option value="LogSoftmax">Log Softmax</option>
        <option value="PReLU">PReLU</option>
        <option value="ReLU">ReLU</option>
        <option value="ReLU6">ReLU 6</option>
        <option value="RReLU">RReLU</option>
        <option value="Sigmoid">Sigmoid</option>
        <option value="SELU">Selu</option>
        <option value="Softmax">Softmax</option>
        <option value="Softmax2d">Softmax 2D</option>
        <option value="Softmin">Softmin</option>
        <option value="Softplus">Softplus</option>
        <option value="Softshrink">Softshrink</option>
        <option value="Softsign">Softsign</option>
        <option value="Tanh">Tanh</option>
        <option value="Tanhshrink">Tanh Shrnik</option>
        `
    }
    document.getElementById("activation-selector").value = layer_config.type;
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();