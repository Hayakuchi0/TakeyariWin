const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
exports.main = function() {
  let mainWindow = null;
  app.on('ready',function(){
    mainWindow = new BrowserWindow({width:600,height:400});
    mainWindow.loadURL('file://'+__dirname+'/index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed',function() {
      mainWindow = null;
    });
  });
  app.on('window-all-closed', function() {
    app.quit();
  });
}
