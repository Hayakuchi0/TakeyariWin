const path = require("path");
const fs = require("fs-extra");
const exec = require("child_process");
const util = require("./../util");
const share = require("./share");
var cmds = {};
cmds["npmInstall"]=["/c","node",path.join("bin","node_modules","npm","bin","npm-cli.js"),"install"];
cmds["tsc"]=["/c","node",path.join("node_modules","typescript","bin","tsc")];
cmds["node"]=["/c","node",path.join("store_bundle","store_src","main.js")];
cmds["ngBuild"]=["/c","node",path.join("node_modules","@angular","cli","bin","ng"),"build","--prod"];
cmds["send"]=["/c","node",path.join("store_bundle","store_src","send","main.js")];
var WindowsBuilder = function(projectPath, put, callback, args) {
  let self = this;
  this.projectPath = projectPath;
  this.put = put;
  this.callback = callback;
  this.args = args;
  this.originPath= "";
  this.build = function() {
    this.npmInstall();
  };
  this.getOptions = function() {
    let options = {
      cwd:self.projectPath,
      env: {
        PATH:process.env.PATH+";"+path.resolve(path.join(self.projectPath,"bin"))
      }
    };
    return options;
  }
  this.npmInstall = function() {
    this.put("downloading dependencies package...");
    let proc = exec.spawn("cmd",cmds["npmInstall"],self.getOptions());
    share.setMessageProc(proc, self.put, self.tsc);
  };
  this.tsc = function(){
    this.put("download end!");
    this.put("building portfolio site.");
    let proc = exec.spawn("cmd",cmds["tsc"],self.getOptions());
    share.setMessageProc(proc,self.put,self.node);
  };
  this.node = function(){
    let proc = exec.spawn("cmd",cmds["node"],self.getOptions());
    share.setMessageProc(proc,self.put,self.ngBuild);
  };
  this.ngBuild = function(){
    let proc = exec.spawn("cmd",cmds["ngBuild"],self.getOptions());
    share.setMessageProc(proc,self.put,self.send);
  };
  this.send = function(){
    let command = cmds["send"].concat(self.args);
    let proc = exec.spawn("cmd",command,self.getOptions());
    share.setMessageProc(proc, self.put, self.end);
  };
  this.end = function(){
    put("complete building.");
    put("build end!");
    callback(true);
  };
}
exports.buildWindows = function(projectPath, put, callback, args) {
  const niw = require("./nodeinstaller/windows");
  niw.nodeInstallProject(util.getResourcePath(), util.getResourcePath() ,projectPath, function(result) {
    if(result) {
      let builder = new WindowsBuilder(projectPath, put, callback, args);
      builder.build();
    } else {
      put("failed to provide tool for build.");
      callback(false);
    }
  },function(message){
    put(message);
  });
};
