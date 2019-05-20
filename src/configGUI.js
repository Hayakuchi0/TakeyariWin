const electron = require("electron");
const ipcRender = electron.ipcRenderer;
const remote = electron.remote;
const save = require('./modules/editconfig/save');
const read = require('./modules/editconfig/read');
const file = require('./modules/editconfig/file');
var CONFIG_DIRECTORY = "";
var saveAll = function() {
  console.log("start save...");
  let configs = {};
  configs['about'] = getValue('about');
  configs['copyright'] = getValue('copyright');
  configs['encoding'] = getValue('encoding');
  configs['sitename'] = getValue('sitename');
  save.saveAll(CONFIG_DIRECTORY, configs);
  saveAboutImage();
  saveTopImage();
  saveFavicon();
  console.log("finished save!");
};
var saveAbout = function() {
  save.saveAbout(CONFIG_DIRECTORY,getValue('about'),getEncoding());
};
var saveCopyright = function() {
  save.saveCopyright(CONFIG_DIRECTORY,getValue('copyright'),getEncoding());
};
var saveEncoding = function() {
  save.saveEncoding(CONFIG_DIRECTORY,getEncoding());
};
var saveSitename = function() {
  save.saveSitename(CONFIG_DIRECTORY,getValue('sitename'),getEncoding());
};
var saveAboutImage = function() {
  file.setAboutImage(CONFIG_DIRECTORY,getDataPath("aboutimage"));
};
var saveTopImage = function() {
  file.setTopImage(CONFIG_DIRECTORY,getDataPath("topimage"));
};
var saveFavicon = function() {
  file.setFavicon(CONFIG_DIRECTORY,getDataPath("favicon"));
};
var readAll = function() {
  let configs = read.readAll(CONFIG_DIRECTORY);
  for(let key in configs) {
    setValue(key,configs[key]);
  }
  readAboutImage();
  readTopImage();
  readFavicon();
};
var readAbout = function() {
  let about = read.readAbout(CONFIG_DIRECTORY);
  setValue('about',about);
};
var readCopyright = function() {
  let copyright = read.readCopyright(CONFIG_DIRECTORY);
  setValue('copyright',copyright);
};
var readEncoding = function() {
  let encoding = read.readEncoding(CONFIG_DIRECTORY);
  setValue('encoding',encoding);
};
var readSitename = function() {
  let sitename = read.readSitename(CONFIG_DIRECTORY);
  setValue('sitename',sitename);
};
var readAboutImage = function() {
  setData('aboutimage', file.getAboutImagePath(CONFIG_DIRECTORY));
};
var readTopImage = function() {
  setData('topimage',file.getTopImagePath(CONFIG_DIRECTORY));
};
var readFavicon = function() {
  setData('favicon', file.getFaviconPath(CONFIG_DIRECTORY));
};
var selectAboutImage = function() {
  setData('aboutimage', getFilePath('aboutimage'));
}
var selectTopImage = function() {
  setData('topimage', getFilePath('topimage'));
}
var selectFavicon = function() {
  setData('favicon', getFilePath('favicon'));
}
var setData = function(configtype, targetPath) {
  let objectTag = document.getElementById('config-view-'+configtype);
  objectTag.data = "";
  objectTag.data = targetPath;
};
var reloadAboutImage = function() {
  let objectTag = document.getElementById('config-view-aboutimage');
  reloadObjectTag(objectTag);
};
var reloadTopImage = function() {
  let objectTag = document.getElementById('config-view-topimage');
  reloadObjectTag(objectTag);
};
var reloadFavicon = function() {
  let objectTag = document.getElementById('config-view-favicon');
  reloadObjectTag(objectTag);
};
var reloadObjectTag = function(objectTag) {
  let tmpWidth = objectTag.style.width;
  objectTag.style.width = "1px";
  objectTag.style.width = tmpWidth;
};
var setValue = function(configtype, value){
  let text = document.getElementById('config-'+configtype);
  text.value = value
}
var getValue = function(configtype) {
  return document.getElementById('config-'+configtype).value;
}
var getFilePath = function(configtype) {
  let fileElement = document.getElementById('config-'+configtype);
  return fileElement.files[0].path;
}
var getDataPath = function(configtype) {
  let result = document.getElementById('config-view-'+configtype).data;
  if(result.startsWith("file:///")) {
    result = result.split("file://")[1];
  }
  return result;
}
var getEncoding = function() {
  return getValue('encoding');
}
ipcRenderer.on('config-window', function(e, message){
  switch(message.type) {
    case "readAll":
      CONFIG_DIRECTORY = message.path;
      readAll();
      break;
    case "defineConfigDirectory":
      CONFIG_DIRECTORY = message.path;
      break;
    default:
      break;
  }
});
window.addEventListener('contextmenu', function(e){
  ipcRenderer.send('context-menu',{type:'basic', e:e, currentWindow:remote.getCurrentWindow()});
});
