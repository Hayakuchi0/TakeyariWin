const path = require("path");
const fs = require("fs-extra");
const exec = require("child_process");
const util = require("./util");
const lni = require("./linuxNodeInstall");

var getProjectDirectory = function() {
  return path.join(process.env[(process.platform == "win32") ? "USERPROFILE" : "HOME"],"TakeyariViewer");
};
var onloadIndex = function(){
  let projectDirectory = document.getElementById("project-directory-path");
  projectDirectory.value = getProjectDirectory();
};
var createProject = function(){
  let projectName = document.getElementById("project-name-new").value;
  if(projectName && (projectName.length > 0)) {
    let projectPath= path.join(getProjectDirectory(),projectName);
    fs.mkdirsSync(getProjectDirectory());
    fs.copySync(path.join(util.getResourcePath(),'TakeyariViewer'),projectPath);
  }
};
var buildProject = function() {
  let projectName = document.getElementById("project-name-build").value;
  if(projectName && (projectName.length > 0)) {
    console.log("build start!");
    let projectPath= path.join(getProjectDirectory(),projectName);
    lni.nodeInstallProjectAtLinux(util.getResourcePath(), util.getResourcePath() ,projectPath, function(result) {
      console.log(result);
      if(result) {
        let buildingProc = exec.spawn(path.join(projectPath,"build.sh"));
        buildingProc.stdout.on('data',function(data) {
          console.log(data.toString());
        });
        buildingProc.stderr.on('data',function(data) {
          console.log(data.toString());
        });
        buildingProc.on('close',function(code) {
          console.log('build end!');
        });
      }
    });
  }
};
