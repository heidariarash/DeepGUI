const electron = require('electron');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', ()=> {
    // Customizing Main Window
    mainWindow = new BrowserWindow({
        minHeight: 1000,
        minWidth: 1700,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
    });

    //Loading the corresponding HTML File
    mainWindow.loadURL(`file://${__dirname}/html/index.html`);
});


//exiting app on close app button
ipcMain.on('exit-app', (evt, arg) => {
    app.quit();
})

//maximizing app on max app button
ipcMain.on('max-app', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
})

//minimizing app on max app button
ipcMain.on('min-app', () => {
    mainWindow.minimize();
})