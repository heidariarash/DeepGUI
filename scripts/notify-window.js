const electron = require('electron');
const {ipcRenderer} = electron;

document.getElementById('ok').addEventListener('click', () => {
    ipcRenderer.send('close-small');
});

(function() {
    ipcRenderer.send('ready-notify-config');
 })();

 ipcRenderer.on('configure-notify', (event, arg) => {
     if(arg[0] === "save"){
        if (arg[1] === "success"){
            document.getElementById('title-sm').innerHTML = "Save Succesful";
            document.getElementsByClassName('main-heading-1')[0].innerHTML = "Diagram has been Saved Successfully"
        }
        else {
            document.getElementById('title-sm').innerHTML = "Save Unsuccessful"
        }
     }
 })