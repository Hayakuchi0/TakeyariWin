const path = require("path");
const fs = require("fs-extra");
const exec = require("child_process");
const util = require("./../util");
const share = require("./share");
exports.buildWindows = function(projectPath, put, args) {
  const niw = require("./nodeinstaller/windows");
  niw.nodeInstallProject(util.getResourcePath(), util.getResourcePath() ,projectPath, function(result) {
    if(result) {
      put("downloading dependencies package.");
      let originPath = process.env["PATH"];
      let npmInstallProc = exec.spawn("cmd",["/c",path.join("bin","node.exe"),path.join("bin","node_modules","npm","bin","npm-cli.js"),"install"],{cwd:projectPath});
      share.setMessageProc(npmInstallProc,put,function(){
        put("building portfolio site.");
        let tscProc = exec.spawn("cmd",["/c",path.join("bin","node.exe"),path.join("node_modules","typescript","bin","tsc")],{cwd:projectPath});
        share.setMessageProc(tscProc,put,function() {
          let nodeProc = exec.spawn("cmd",["/c",path.join("bin","node.exe"),path.join("store_bundle","store_src","main.js")],{cwd:projectPath});
          share.setMessageProc(nodeProc,put,function(){
            let ngBuildProc = exec.spawn("cmd",["/c",path.join("bin","node.exe"),path.join("node_modules","@angular","cli","bin","ng"),"build","--prod"],{cwd:projectPath});
            share.setMessageProc(ngBuildProc,put,function(){
              let command = ["/c",path.join("bin","node.exe"),path.join("store_bundle","store_src","send","main.js")].concat(args);
              let sendProc = exec.spawn("cmd",command,{cwd:projectPath});
              share.setMessageProc(sendProc, put, function() {
                put("complete building.");
                put("build end!");
              });
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
