const path = require("path");
const fs = require("fs-extra");
const exec = require("child_process");
const util = require("./modules/util");
const nil = require("./modules/nodeinstaller/linux");
const niw = require("./modules/nodeinstaller/windows");

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
    put("build start!");
    let projectPath= path.join(getProjectDirectory(),projectName);
    if(process.platform === "linux") {
      buildLinux(projectPath);
    } else if(process.platform === "win32") {
    }
  }
};
var buildLinux = function(projectPath) {
  nil.nodeInstallProject(util.getResourcePath(), util.getResourcePath() ,projectPath, function(result) {
    if(result) {
      let buildingProc = exec.spawn(path.join(projectPath,"build.sh"));
      setMessageProc(buildingProc,function(){
        put("build end!");
      });
    } else {
      put("failed to provide tool for build.");
    }
  });
};
var buildWindows = function(projectPath) {
  niw.nodeInstallProject(util.getResourcePath(), util.getResourcePath() ,projectPath, function(result) {
    if(result) {
      put("downloading dependencies package.");
      let npmInstallProc = exec.spawn(path.join("npm"),["install"],{cwd:projectPath});
      setMessageProc(npmInstallProc,function(){
        put("building portfolio site.");
        let tscProc = exec.spawn(path.join("node_modules",".bin","tsc"),{cwd:projectPath});
        setMessageProc(tscProc,function() {
          let nodeProc = exec.spawn(path.join("node"),[path.join("store_bundle","store_src","main.js")],{cwd:projectPath});
          setMessageProc(nodeProc,function(){
            let ngBuildProc = exec.spawn(path.join("node_modules",".bin","ng"),["build","--prod"],{cwd:projectPath});
            setMessageProc(ngBuildProc,function(){
              put("complete building.");
              put("build end!");
            });
          });
        });
      });
    } else {
      put("failed to provide tool for build.");
    }
  });
};
var setMessageProc = function(proc,callback){
  proc.stdout.on('data',function(data) {
    put(data.toString());
  });
  proc.stderr.on('data',function(data) {
    put(data.toString());
  });
  proc.on('close',function(code) {
    if(callback) {
      callback();
    }
  });
}
var put = function(message) {
  console.log(message);
}
