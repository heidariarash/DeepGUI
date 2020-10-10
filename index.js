const electron = require('electron');
const generate_code = require('./scripts/generate');

const { app, BrowserWindow, ipcMain, dialog } = electron;

let mainWindow;
let configureWindow;

app.on('ready', ()=> {
    // Customizing Main Window
    mainWindow = new BrowserWindow({
        minHeight: 700,
        minWidth: 1100,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: __dirname + '/gallery/icon.png'
    });

    //Loading the corresponding HTML File
    mainWindow.loadURL(`file://${__dirname}/html/index.html`);
    mainWindow.maximize();
});


//exiting app on close app button
ipcMain.on('exit-app', () => {
    app.quit();
});

//maximizing app on max app button
ipcMain.on('max-app', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow.maximize();
    }
});

//minimizing app on max app button
ipcMain.on('min-app', () => {
    mainWindow.minimize();
});

//New Layer Request
ipcMain.on('new-layer-request', () => {
    configureWindow = new BrowserWindow({
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        width: 400,
        height: 300,
        resizable: false,
        maximizable: false,
        parent: mainWindow,
        modal: true
    });

    configureWindow.loadURL(`file://${__dirname}/html/new-layer.html`);
});

//New Layer Add
ipcMain.on('add-new-layer', (evt, args) => {
    mainWindow.webContents.send('add-new-layer', args);
    configureWindow.close();
});

//cancle in Add New Layer Window
ipcMain.on('close-small', () => {
    configureWindow.close();
})

//generate button clicked
ipcMain.on('generate-code', async (event, arg) => {
    let folder_path = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
    if(~folder_path.canceled){
        let success = await generate_code(arg, folder_path.filePaths[0]);
        console.log(success)
        if (success){
            configureWindow = new BrowserWindow({
                frame: false,
                webPreferences: {
                    nodeIntegration: true
                },
                width: 400,
                height: 350,
                resizable: false,
                maximizable: false,
                parent: mainWindow,
                modal: true
            });
            configureWindow.loadURL(`file://${__dirname}/html/code-generated-success.html`);
        }
        else {
            configureWindow = new BrowserWindow({
                frame: false,
                webPreferences: {
                    nodeIntegration: true
                },
                width: 400,
                height: 400,
                resizable: false,
                maximizable: false,
                parent: mainWindow,
                modal: true
            });
            configureWindow.loadURL(`file://${__dirname}/html/code-generated-unsuccess.html`);
        }
    }
});

//input shape cog clicked
ipcMain.on('input-shape-cog', () => {
    configureWindow = new BrowserWindow({
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        width: 400,
        height: 300,
        resizable: false,
        maximizable: false,
        parent: mainWindow,
        modal: true
    });

    configureWindow.loadURL(`file://${__dirname}/html/input-shape-config.html`);
});

//resize the small window
ipcMain.on('resize-small', (event, arg) => {
    configureWindow.setSize(400, 300 + arg * 50);
})