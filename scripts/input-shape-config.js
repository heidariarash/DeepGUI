const {ipcRenderer} = require('electron');

input_shape = [10];
input_number = 1;

delete

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('add-sth').addEventListener('click', () => {
    ipcRenderer.send('resize-small', input_number);
    input_number += 1;
    let new_dimension;
    let attr;
    //setting the attributes
    document.getElementsByClassName('scrollable')[0].innerHTML += `<input class="dimension" id="dimension-${input_number}" type="number" step="1" min="1" value="1">
    <svg class="trash" id="dimension-${input_number}-trash" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" onclick="delete_dimension(this)">
        <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/>
    </svg>
    <br>`
});