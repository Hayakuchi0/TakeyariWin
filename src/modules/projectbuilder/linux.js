const path = require("path");
const fs = require("fs-extra");
const exec = require("child_process");
const util = require("./../util");
const share = require("./share");
exports.buildLinux = function(projectPath,put,callback,args) {
  if(!(args)) {
    args = [];
  }
  const nil = require("./nodeinstaller/linux");
  nil.nodeInstallProject(util.getResourcePath(), util.getResourcePath() ,projectPath, function(result) {
    if(result) {
      let buildingProc = exec.spawn(path.join(projectPath,"build.sh"),args);
      share.setMessageProc(buildingProc, put, function(){
        put("build end!");
        callback(true);
      });
    } else {
      put("failed to provide tool for build.");
      callback(false);
    }
  },function(message){
    put(message);
  });
};
