const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const app = electron.app;
var mainWindow = null;
var configWindow = null;
exports.main = function() {
  app.on('ready',function(){
    mainWindow = new BrowserWindow({width:512,height:768});
    mainWindow.maximize();
    mainWindow.loadURL('file://'+__dirname+'/index.html');
    mainWindow.on('closed',function() {
      mainWindow = null;
      app.quit();
    });
    configWindow = new BrowserWindow({parent:mainWindow,width:600,height:400,show:false});
    configWindow.loadURL('file://'+__dirname+'/config.html');
    configWindow.on('close',function(e){
      e.preventDefault();
      configWindow.hide();
    });
    sendWindow = new BrowserWindow({parent:mainWindow,width:600,height:400,show:false});
    sendWindow.loadURL('file://'+__dirname+'/send.html');
    sendWindow.on('close',function(e){
      e.preventDefault();
      sendWindow.hide();
    });
  });
  app.on('window-all-closed', function() {
    app.quit();
  });
}
ipcMain.on('config-control',function(e, message){
  switch(message.type) {
    case "open":
      configWindow.show();
      configWindow.focus();
      configWindow.webContents.send('config-window',{type:'readAll',path:message.path});
      break;
    case "defineConfigDirectory":
      configWindow.webContents.send('config-window',{type:'defineConfigDirectory',path:message.path});
      break;
    default:
      break;
  }
});
ipcMain.on('send-control',function(e, message){
  switch(message.type) {
    case "open":
      sendWindow.show();
      sendWindow.focus();
      sendWindow.webContents.send('send-window',{type:'read', path:message.path, protocol:message.protocol});
      break;
    case "changeProtocol":
      sendWindow.webContents.send('send-window',{type:'changeProtocol',path:message.path, protocol:message.protocol});
      break;
    default:
      break;
  }
});
var menuBasic = new Menu();
menuBasic.append(new MenuItem({ label:"Copy", accelarator: "CommandOrCtrl+C", role: "copy"}));
menuBasic.append(new MenuItem({ label:"Cut", accelarator: "CommandOrCtrl+T", role: "cut"}));
menuBasic.append(new MenuItem({ label:"Paste", accelarator: "CommandOrCtrl+V", role: "paste"}));
ipcMain.on('context-menu',function(e, message){
  switch(message.type) {
    case "basic":
      menuBasic.popup(message.currentWindow);
      break;
    default:
      break;
  }
});
