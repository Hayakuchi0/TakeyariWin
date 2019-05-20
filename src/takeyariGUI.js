const electron = require("electron")
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;
const shell = electron.shell;
const path = require("path");
const fs = require("fs-extra");
const exec = require("child_process");
const util = require("./modules/util");
var getProjectDirectory = function() {
  return path.join(process.env[(process.platform == "win32") ? "USERPROFILE" : "HOME"],"TakeyariViewer");
};
var onloadIndex = function(){
  let projectDirectory = document.getElementById("project-directory-path");
  projectDirectory.value = getProjectDirectory();
  reloadProjectsList();
};
var createProject = function(){
  clean();
  let projectName = document.getElementById("project-name-new").value;
  if(projectName && (projectName.length > 0)) {
    let pdpath = projectDirectoryValue();
    fs.mkdirsSync(pdpath);
    let projectPath= path.join(pdpath,projectName);
    if(fs.existsSync(projectPath)) {
        put("project already exist.");
    } else {
      fs.copySync(path.join(util.getResourcePath(),'TakeyariViewer'),projectPath);
      if(fs.existsSync(projectPath)) {
        fs.mkdirsSync(path.join(projectPath,"CONTENT"));
        put("project create success!");
        reloadProjectsList();
      }
    }
  } else {
    put("project name is valid.");
  }
};
var buildProject = function() {
  clean();
  let projectName = document.getElementById("project-name-build").value;
  let pdpath = projectDirectoryValue();
  if(projectName && (projectName.length > 0)) {
    let projectPath= path.join(pdpath,projectName);
    if(fs.existsSync(projectPath)) {
      put("build start!");
      let args = [];
      let sendWithBuild = document.getElementById("send-with-build");
      if(sendWithBuild.checked) {
        let protocol = document.getElementById("protocol");
        if(protocol.value == "none") {
          put("Please select protocol.");
          return;
        } else {
          args.push(protocol.value);
        }
      }
      if(process.platform === "linux") {
        const projectbuilder = require("./modules/projectbuilder/linux");
        projectbuilder.buildLinux(projectPath, put, preview, args);
      } else if(process.platform === "win32") {
        const projectbuilder = require("./modules/projectbuilder/windows");
        projectbuilder.buildWindows(projectPath, put, preview, args);
      }
    } else {
      put("project is not exist.");
    }
  } else {
    put("project name is invalid.");
  }
};
var openConfig = function() {
  ipcRenderer.send('config-control',{type:'open', path:path.join(workingDirectoryPath(),'CONFIG')});
};
var openContent = function() {
  let contentDirectory = path.join(workingDirectoryPath(), "CONTENT");
  if(fs.existsSync(workingDirectoryPath())) {
    shell.openItem(contentDirectory);
  } else {
    clean();
    put("project is not create yet.");
  }
}
var openSend = function() {
  let protocol = document.getElementById("protocol").value;
  ipcRenderer.send('send-control',{type:'open', path:path.join(workingDirectoryPath(),'CONFIG','send'), protocol:protocol});
};
var reloadProjectDirectory = function() {
  let fileElement = document.getElementById("project-directory-selecter");
  let pathElement = document.getElementById("project-directory-path");
  pathElement.value = fileElement.files[0].path;
  let projectName = document.getElementById("project-name-build").value;
  ipcRenderer.send('config-control',{type:'defineConfigDirectory', path:path.join(projectDirectoryValue(),projectName,'CONFIG')});
};
var reloadProjectsList = function() {
  fs.readdir(projectDirectoryValue(), function(err, files){
    if (err){
      if(err.message.startsWith("ENOENT: no such file or directory,")) {
        return;
      }
      put(err.name);
      put(err.message);
      throw err;
    }
    let selectElement = document.getElementById("project-name-selector");
    let optionLength = selectElement.options.length;
    for(let i=0;i<optionLength;i++){
      selectElement.remove(0);
    }
    files.forEach(function(file){
      var optionElement = document.createElement("option");
      optionElement.value = file;
      optionElement.innerText = file;
      selectElement.appendChild(optionElement);
    });
    if(selectElement.options.length<1) {
      var optionElement = document.createElement("option");
      optionElement.value = "";
      optionElement.innerText = "候補なし";
      selectElement.appendChild(optionElement);
    } else {
      reloadProjectName();
    }
  });
}
var reloadProjectName = function() {
  let nameElement = document.getElementById("project-name-build");
  let selectElement = document.getElementById("project-name-selector");
  nameElement.value = selectElement.value;
  ipcRenderer.send('config-control',{type:'defineConfigDirectory', path:path.join(projectDirectoryValue(),nameElement.value,'CONFIG')});
}
var reloadProtocol = function() {
  let protocol = document.getElementById("protocol").value;
  ipcRenderer.send('send-control',{type:'changeProtocol', path:path.join(workingDirectoryPath(),'CONFIG','send'), protocol:protocol});
}
var clean = function() {
  let messageElement = document.getElementById("messageElement");
  messageElement.value = "";
};
var put = function(message) {
  let messageElement = document.getElementById("messageElement");
  messageElement.value = messageElement.value + "\n" + message;
  messageElement.scrollTop = messageElement.scrollHeight;
};
var preview = function(result) {
  if(result == true) {
    let address = path.resolve(path.join(workingDirectoryPath(),"dist","TakeyariViewer","index.html"));
    if(path.sep != "/") {
      let splitedAddress = address.split(path.sep);
      address = "";
      splitedAddress.forEach(function(filename){
        address = address + "/" + filename;
      });
    }
    address = "file://" + address;
    shell.openExternal(address);
  }
};
var projectDirectoryValue = function() {
  let pdElement = document.getElementById("project-directory-path");
  return pdElement.value;
}
var workingDirectoryPath = function() {
  let projectName = document.getElementById("project-name-build").value;
  let pdpath = projectDirectoryValue();
  return path.join(pdpath,projectName);
}
window.addEventListener('contextmenu', function(e){
  ipcRenderer.send('context-menu',{type:'basic', e:e, currentWindow:remote.getCurrentWindow()});
});
