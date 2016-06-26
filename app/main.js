/*jshint node: true*/
'use strict';

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let onlineStatusWindow;

function createWindow() {
  //Removed frame:false to make testing easier
  mainWindow = new BrowserWindow({width: 1000, height: 800});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.openDevTools(); //DevTools

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  onlineStatusWindow = new BrowserWindow({width: 0, height: 0, show: false});
  onlineStatusWindow.loadURL(`file://${__dirname}/online-status.html`);
});

ipcMain.on('online-status-changed', (event, status) => {
  console.log(status);
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
