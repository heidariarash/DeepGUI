const {ipcRenderer} = require('electron');

input_shape = [
    {
        id : "dimension-1" ,
        value : 10
    }
];

input_number = 1;
removed_dims = 0;

delete_dimension = (element) => {
    for (let i=0; i < input_shape.length; i++) {
        if (input_shape[i].id === element.id.slice(0,-6)) {
            input_shape.splice(i, 1);
            dim_to_remove = document.getElementById(element.id.slice(0,-6));
            dim_to_remove.parentNode.removeChild(dim_to_remove.nextSibling.nextSibling);
            dim_to_remove.parentNode.removeChild(dim_to_remove.nextSibling);
            dim_to_remove.parentNode.removeChild(dim_to_remove);
            break;
        }
    }
    removed_dims += 1;
    ipcRenderer.send('resize-small', input_number - removed_dims -1);
}

change_dim = element => {
    for (let i=0; i < input_shape.length; i++) {
        if (input_shape[i].id === element.id) {
            input_shape[i].value = element.value;
            break;
        }
    }
}

document.getElementById('cancle').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

document.getElementById('add-sth').addEventListener('click', () => {
    ipcRenderer.send('resize-small', input_number - removed_dims);
    input_number += 1;
    //setting the attributes
    document.getElementsByClassName('scrollable')[0].innerHTML += `<input class="dimension" id="dimension-${input_number}" type="number" step="1" min="1" value="1" onchange="change_dim(this);">
    <svg class="trash" id="dimension-${input_number}-trash" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" onclick="delete_dimension(this)">
        <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/>
    </svg>`
    input_shape.push({
        id: `dimension-${input_number}`,
        value: 1
    });
    for(dim of input_shape){
        document.getElementById(dim.id).value = dim.value;
    }
});

document.getElementById('done').addEventListener('click', ()=> {
    dimensions = [];
    for(dim of input_shape){
        dimensions.push(dim.value);
    }
    ipcRenderer.send('set-dimensions', dimensions);
});