const electron      = require('electron');
const {ipcRenderer} = electron;

document.getElementById('ok').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

ipcRenderer.on('configure-notify', (event, arg) => {
    if(arg[0] === "save"){
        if (arg[1] === "success"){
            document.getElementById('title-sm').innerHTML                  = "Save Succesful";
            document.getElementsByClassName('main-heading-1')[0].innerHTML = "Diagram has been saved Successfully";
        }
        else {
            document.getElementById('title-sm').innerHTML                  = "Save Unsuccessful";
        }
    }
    else if(arg[0] == "load"){
        if (arg[1] === "success"){
            document.getElementById('title-sm').innerHTML                  = "Load Succesful";
            document.getElementsByClassName('main-heading-1')[0].innerHTML = "Diagram has been loaded Successfully";
        }
        else {
            document.getElementById('title-sm').innerHTML                  = "Load Unsuccessful";
        }
    }
});


 (function() {
     ipcRenderer.send('ready-notify-config');
  })();