const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote;
const ftp = require("./modules/editconfig/send/ftp");

var SEND_DIRECTORY = "";
var PROTOCOL = "";
var reloadProtocol = function(protocol, path) {
  SEND_DIRECTORY = path;
  PROTOCOL = protocol;
  let title = document.getElementById("protocolTitle");
  title.innerText = PROTOCOL.toUpperCase();
  let inputField = document.getElementById("sendConfig");
  inputField.textContent = null;
  switch(PROTOCOL) {
    case "ftp":
      initFtpConfig();
      break;
    default:
      break;
  }
};
var save = function() {
  switch(PROTOCOL) {
    case "ftp":
      saveFtp();
      break;
    default:
      break;
  }
};
var read = function() {
  switch(PROTOCOL) {
    case "ftp":
      readFtp();
      break;
    default:
      break;
  }
};
var initFtpConfig = function() {
  let inputField = document.getElementById("sendConfig");
  ftp.fields.forEach(function(field) {
    let subjectElement = document.createElement("h2");
    subjectElement.innerText = field;
    let fieldElement = document.createElement("input");
    fieldElement.type = "text";
    fieldElement.id = "config-send-"+PROTOCOL+"-"+field;
    inputField.appendChild(subjectElement);
    inputField.appendChild(fieldElement);
  });
  readFtp();
};
var readFtp = function() {
  let inputField = document.getElementById("sendConfig");
  let ftpText = ftp.read(SEND_DIRECTORY);
  let ftpJson = JSON.parse(ftpText);
  ftp.fields.forEach(function(field) {
    let fieldElement = document.getElementById("config-send-"+PROTOCOL+"-"+field);
    fieldElement.value = ftpJson[field];
  });
}
var saveFtp = function() {
  let inputField = document.getElementById("sendConfig");
  let writeConfig = {};
  ftp.fields.forEach(function(field) {
    let fieldElement = document.getElementById("config-send-"+PROTOCOL+"-"+field);
    writeConfig[field] = fieldElement.value;
  });
  ftp.save(SEND_DIRECTORY, writeConfig);
}
ipcRender.on('send-window', function(e, message){
  switch(message.type) {
    case "read":
      reloadProtocol(message.protocol, message.path);
      break;
    case "changeProtocol":
      reloadProtocol(message.protocol, message.path);
      break;
    default:
      break;
  }
});
window.addEventListener('contextmenu', function(e){
  ipcRenderer.send('context-menu',{type:'basic', e:e, currentWindow:remote.getCurrentWindow()});
});
