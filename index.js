const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

app.on('ready', ()=> {
    // Customizing Main Window
    mainWindow = new BrowserWindow({
        minHeight: 950,
        minWidth: 1370,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.setBounds({
        x: 300,
        y: 100
    });

    //Loading the corresponding HTML File
    mainWindow.loadURL(`file://${__dirname}/html/index.html`);
});

ipcMain.on('exit-app', (evt, arg) => {
    app.quit();
})

const menuMainWindow = [
    // {
    //     label: 'Deep GUI'
    // }
]

if(process.platform === 'darwin') {
    menuMainWindow.unshift({})
}