const {ipcRenderer} = require('electron');

input_shape = [10];
input_number = 1;

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('add-sth').addEventListener('click', () => {
    ipcRenderer.send('resize-small', input_number);
    input_number += 1;
    let new_dimension = document.createElement('input');
    let attr;
    //setting the attributes
    attr = document.createAttribute('class');
    attr.value = 'dimension';
    new_dimension.setAttributeNode(attr);
    attr = document.createAttribute('id');
    attr.value = `dimension-${input_number}`;
    new_dimension.setAttributeNode(attr);
    attr = document.createAttribute('type');
    attr.value = "number";
    new_dimension.setAttributeNode(attr);
    attr = document.createAttribute('step');
    attr.value = "1";
    new_dimension.setAttributeNode(attr);
    attr = document.createAttribute('min');
    attr.value = "1";
    new_dimension.setAttributeNode(attr);
    attr = document.createAttribute('value');
    attr.value = "1";
    new_dimension.setAttributeNode(attr);
    document.getElementsByClassName('scrollable')[0].insertBefore(new_dimension, document.getElementById('add-sth'));
    new_dimension = document.createElement("br");
    document.getElementsByClassName('scrollable')[0].insertBefore(new_dimension, document.getElementById('add-sth'));
});