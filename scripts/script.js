const electron = require('electron');
const {ipcRenderer} = electron;

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
    if (['TensorFlow', 'PyTorch'].indexOf(document.getElementById('framework-selector').value) < 0) {
        document.getElementById('framework-attention').setAttribute('style','opacity: 1');
    }
    else if(['SGD', 'RMSProp', 'Adam'].indexOf(document.getElementById('optimizer-selector').value) < 0){
        document.getElementById('framework-attention').setAttribute('style','opacity: 0');
        document.getElementById('optimizer-select-attention').setAttribute('style','opacity: 1');
    }
    else if(document.getElementById('optimizer-lr').value <= 0){
        document.getElementById('framework-attention').setAttribute('style','opacity: 0');
        document.getElementById('optimizer-select-attention').setAttribute('style','opacity: 0');
        document.getElementById('lr-attention').setAttribute('style','opacity: 1');
    }
    else if(['Mean Squared Error', 'Binary Cross Entropy', 'Categorical Cross Entropy', 'Sparse Binary Cross Entropy', 'Sparse Categorical Cross Entropy'].indexOf(document.getElementById('loss-function-selector').value) < 0){
        document.getElementById('framework-attention').setAttribute('style','opacity: 0');
        document.getElementById('optimizer-select-attention').setAttribute('style','opacity: 0');
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('loss-attention').setAttribute('style','opacity: 1');
    }
    else if(document.getElementById('epoch').value < 1){
        document.getElementById('framework-attention').setAttribute('style','opacity: 0');
        document.getElementById('optimizer-select-attention').setAttribute('style','opacity: 0');
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('loss-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 1');
    }
    else if(document.getElementById('batch').value < 1){
        document.getElementById('framework-attention').setAttribute('style','opacity: 0');
        document.getElementById('optimizer-select-attention').setAttribute('style','opacity: 0');
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('loss-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
        document.getElementById('batch-attention').setAttribute('style','opacity: 1');
    }
    else {
        document.getElementById('framework-attention').setAttribute('style','opacity: 0');
        document.getElementById('optimizer-select-attention').setAttribute('style','opacity: 0');
        document.getElementById('lr-attention').setAttribute('style','opacity: 0');
        document.getElementById('loss-attention').setAttribute('style','opacity: 0');
        document.getElementById('epoch-attention').setAttribute('style','opacity: 0');
        document.getElementById('batch-attention').setAttribute('style','opacity: 0');
        ipcRenderer.send('generate-code', {
            framework: document.getElementById('framework-selector').value,
            optimizer: document.getElementById('optimizer-selector').value,
            lr: document.getElementById('optimizer-lr').value,
            loss: document.getElementById('loss-function-selector').value,
            epoch: document.getElementById('epoch').value,
            batch: document.getElementById('batch').value
        });
    }
});

document.getElementById('input-shape-cog').addEventListener('click', () => {
    ipcRenderer.send('input-shape-cog');
});