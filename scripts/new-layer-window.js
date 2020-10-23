const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('done').addEventListener('click', () => {
    ipcRenderer.send('add-new-layer', document.getElementById('layer-selector').value);
});

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

ipcRenderer.on("layer-config", (event , arg) => {
    if(arg.framework === "PyTorch"){
        document.getElementById('layer-selector').innerHTML = `
        <option value="Activation">Activation</option>
        <option value="Avg Pool 1D">Avg Pool 1D</option>
        <option value="Avg Pool 2D">Avg Pool 2D</option>
        <option value="Avg Pool 3D">Avg Pool 3D</option>
        <option value="Batch Norm 1D">Batch Norm 1D</option>
        <option value="Batch Norm 2D">Batch Norm 2D</option>
        <option value="Batch Norm 3D">Batch Norm 3D</option>
        <option value="Convolution 1D">Convolution 1D</option>
        <option value="Convolution 2D">Convolution 2D</option>
        <option value="Convolution 3D">Convolution 3D</option>
        <option value="Linear">Dense</option>
        <option value="Dropout">Dropout</option>
        <option value="Embedding">Embedding</option>
        <option value="Flatten">Flatten</option>
        <option value="GRU">GRU</option>
        <option value="LSTM">LSTM</option>
        <option value="Max Pool 1D">Max Pool 1D</option>
        <option value="Max Pool 2D">Max Pool 2D</option>
        <option value="Max Pool 3D">Max Pool 3D</option>
        <option value="RNN">RNN</option>
        `
    }
});

(function() {
    ipcRenderer.send('ready-layer-config');
 })();