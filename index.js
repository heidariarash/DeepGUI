const electron = require('electron');

const { app } = electron;


app.on('ready', ()=> {
    console.log("App is Ready");
});