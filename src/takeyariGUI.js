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
  let projectName = document.getElementById("project-name-new").value;
  if(projectName && (projectName.length > 0)) {
    let projectPath= path.join(getProjectDirectory(),projectName);
    fs.mkdirsSync(getProjectDirectory());
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
  let projectName = document.getElementById("project-name-build").value;
  if(projectName && (projectName.length > 0)) {
    put("build start!");
    let projectPath= path.join(getProjectDirectory(),projectName);
    if(process.platform === "linux") {
      buildLinux(projectPath);
    } else if(process.platform === "win32") {
      buildWindows(projectPath);
    }
  }
};
var buildLinux = function(projectPath) {
  const nil = require("./modules/nodeinstaller/linux");
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
  const niw = require("./modules/nodeinstaller/windows");
  niw.nodeInstallProject(util.getResourcePath(), util.getResourcePath() ,projectPath, function(result) {
    if(result) {
      put("downloading dependencies package.");
      let originPath = process.env["PATH"];
      let npmInstallProc = exec.spawn("cmd",["/c",path.join("bin","node.exe"),path.join("bin","node_modules","npm","bin","npm-cli.js"),"install"],{cwd:projectPath});//パスを通し、文字コードをutf-8に変更する必要がある
      setMessageProc(npmInstallProc,function(){
        put("building portfolio site.");
        let tscProc = exec.spawn("cmd",["/c",path.join("bin","node.exe"),path.join("node_modules","typescript","bin","tsc")],{cwd:projectPath});
        setMessageProc(tscProc,function() {
          let nodeProc = exec.spawn("cmd",["/c",path.join("bin","node.exe"),path.join("store_bundle","store_src","main.js")],{cwd:projectPath});
          setMessageProc(nodeProc,function(){
            let ngBuildProc = exec.spawn("cmd",["/c",path.join("bin","node.exe"),path.join("node_modules","@angular","cli","bin","ng"),"build","--prod"],{cwd:projectPath});
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
  },function(message){
    put(message);
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
