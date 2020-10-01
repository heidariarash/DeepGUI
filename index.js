const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', ()=> {
    // Customizing Main Window
    mainWindow = new BrowserWindow({
        minHeight: 950,
        minWidth: 1370,
        frame: false
    });

    mainWindow.setBounds({
        x: 300,
        y: 100
    });

    //Loading the corresponding HTML File
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

const menuMainWindow = [
    // {
    //     label: 'Deep GUI'
    // }
]

if(process.platform === 'darwin') {
    menuMainWindow.unshift({})
}