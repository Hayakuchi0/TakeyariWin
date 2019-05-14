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
};
var createProject = function(){
  clean();
  let projectName = document.getElementById("project-name-new").value;
  if(projectName && (projectName.length > 0)) {
    let projectDirectory = document.getElementById("project-directory-path");
    pdpath = projectDirectory.value;
    fs.mkdirsSync(pdpath);
    let projectPath= path.join(pdpath,projectName);
    if(fs.existsSync(projectPath)) {
        put("project already exist.");
    } else {
      fs.copySync(path.join(util.getResourcePath(),'TakeyariViewer'),projectPath);
      if(fs.existsSync(projectPath)) {
        put("project create success!");
      }
    }
  }
};
var buildProject = function() {
  clean();
  let projectName = document.getElementById("project-name-build").value;
  if(projectName && (projectName.length > 0)) {
    put("build start!");
    let projectDirectory = document.getElementById("project-directory-path");
    pdpath = projectDirectory.value;
    let projectPath= path.join(pdpath,projectName);
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
      projectbuilder.buildLinux(projectPath,put,args);
    } else if(process.platform === "win32") {
      const projectbuilder = require("./modules/projectbuilder/windows");
      projectbuilder.buildWindows(projectPath,put,args);
    }
  }
};
var clean = function() {
  let messageElement = document.getElementById("messageElement");
  messageElement.value = "";
}
var put = function(message) {
  let messageElement = document.getElementById("messageElement");
  messageElement.value = messageElement.value + "\n" + message;
  messageElement.scrollTop = messageElement.scrollHeight;
}
