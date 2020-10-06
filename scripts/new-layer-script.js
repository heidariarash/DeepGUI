const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('done').addEventListener('click', () => {
    let new_layer = document.getElementById('layer-selector').value
    if (['Linear', 'Convolution 1D', 'Convolution 2D', 'Convolution 3D', 'Max Pool 1D', 'Max Pool 2D','Max Pool 3D','Activation'].indexOf(new_layer) >= 0) {
        ipcRenderer.send('add-new-layer', new_layer);
    }
    else{
        document.getElementById('new-layer-attention').setAttribute('style','opacity: 1');
    }
});

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-new-layer');
});