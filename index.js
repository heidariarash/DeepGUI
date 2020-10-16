const electron = require('electron');
const generate_code = require('./scripts/generate');

const { app, BrowserWindow, ipcMain, dialog } = electron;

let mainWindow;
let configureWindow;
let dimensions = [10];
let layer_under_config;

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
    if(folder_path.canceled === false){
        let success = await generate_code(arg, dimensions, folder_path.filePaths[0]);
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
        height: 350,
        resizable: false,
        maximizable: false,
        parent: mainWindow,
        modal: true
    });
    
    configureWindow.loadURL(`file://${__dirname}/html/input-shape-config.html`);
});

// resize the small window
ipcMain.on('resize-small', (event, arg) => {
    configureWindow.setBounds({width: 400, height: Math.min(350 + arg * 50, 500)});
});

//setting the input dimensions
ipcMain.on('set-dimensions', (event, arg) => {
    configureWindow.close();
    dimensions = arg;
    mainWindow.webContents.send('set-input-shape', dimensions);
});

//sending initialization parameters to input config window
ipcMain.on('ready-input-config', () => {
    configureWindow.webContents.send('initialize', dimensions);
});

//configuring a layer
ipcMain.on("config-layer", (event, arg) => {
    configureWindow = new BrowserWindow({
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        width: 400,
        height: 370,
        resizable: false,
        maximizable: false,
        parent: mainWindow,
        modal: true
    });

    layer_under_config = arg;
    
    switch(arg.name){
        case "Convolution 1D":
        case "Convolution 2D":
        case "Convolution 3D":
            configureWindow.loadURL(`file://${__dirname}/html/convolution-config.html`);
            break;
        case "Max Pool 1D":
        case "Max Pool 2D":
        case "Max Pool 3D":
        case "Avg Pool 1D":
        case "Avg Pool 2D":
        case "Avg Pool 3D":
            configureWindow.setBounds({width: 400, height: 300});
            configureWindow.loadURL(`file://${__dirname}/html/pooling-config.html`);
            break;
        case "RNN":
        case "LSTM":
        case "GRU":
            configureWindow.loadURL(`file://${__dirname}/html/recurrent-config.html`);
            break;
        case "Linear":
            configureWindow.setBounds({width: 400, height: 300});
            configureWindow.loadURL(`file://${__dirname}/html/dense-config.html`);
            break;
        case "Embedding":
            configureWindow.loadURL(`file://${__dirname}/html/embedding-config.html`);
            break;
        case "Activation":
            configureWindow.setBounds({width: 400, height: 300});
            configureWindow.loadURL(`file://${__dirname}/html/activation-config.html`);
            break;
        default:
            configureWindow.close();
    }
});

//sending initialization parameters to layer config window
ipcMain.on("ready-layer-config", () => {
    configureWindow.webContents.send("layer-config", layer_under_config);
});

//getting layer config
ipcMain.on("layer-config-finish", (event, arg) => {
    configureWindow.close();
    mainWindow.webContents.send("set-config", arg);
});