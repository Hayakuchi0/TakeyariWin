const wget = require('node-wget');
const path = require('path');
const fs = require('fs-extra');
const unzip = require('unzip');
exports.nodeInstallProject = function(downloadZipDir, outputDir, projectDir, callback, message) {
  let result = false;
  let params = {};
  params['callback'] = put(callback);
  params['message'] = put(message);
  params['nodeVersion'] = '8.10.0';
  params['nodeBaseName'] = 'node-v'+params['nodeVersion']+'-win-'+process.arch;
  params['nodeName'] = params['nodeBaseName'] + '.zip';
  params['nodeUrl'] = 'https://nodejs.org/dist/v'+params['nodeVersion']+'/'+params['nodeName'];
  params['nodePath'] = path.join(downloadZipDir,params['nodeName']);
  params['outputPath']  = path.join(outputDir,'output');
  params['npmDependDir'] = path.join(projectDir,'bin','node_modules','npm');
  params['fromCopyDirectory'] = path.join(params['outputPath'],params['nodeBaseName']);
  params['nodeFromPath'] = path.join(params['outputPath'],params['nodeBaseName'],'node.exe');
  params['nodeToPath'] = path.join(projectDir,'bin','node.exe');
  params['npmBinFromPath'] = path.join(params['outputPath'],params['nodeBaseName'],'node_modules','npm','bin');
  params['npmBinToPath'] = path.join(params['npmDependDir'],'bin');
  params['npmLibFromPath'] = path.join(params['outputPath'],params['nodeBaseName'],'node_modules','npm','lib');
  params['npmLibToPath'] = path.join(params['npmDependDir'],'lib');
  params['npmModuleFromPath'] = path.join(params['outputPath'],params['nodeBaseName'],'node_modules','npm','node_modules');
  params['npmModuleToPath'] = path.join(params['npmDependDir'],'node_modules');
  params['npmPackageFromPath'] = path.join(params['outputPath'],params['nodeBaseName'],'node_modules','npm','package.json');
  params['npmPackageToPath'] = path.join(params['npmDependDir'],'package.json');
  if(fs.existsSync(params['outputPath'])) {
    params['message']("output is exist");
    stepCopyCommand(params);
  } else {
    if(fs.existsSync(params['nodePath'])) {
      stepDecompressNodeZip(params);
    }
    else {
      stepWgetNode(params)
    }
  }
};
async function stepWgetNode(params) {
  params['message']('start download '+params['nodeName']);
  await wget({url:params['nodeUrl'],dest:params['nodePath']}, async function(error, response, body) {
    if(error) {
      params['message'](error);
      fs.removeSync(params['nodePath']);
      params['callback'](false);
    } else {
      params['message']('end download!');
      await stepDecompressNodeZip(params);
    }
  });
}
async function stepDecompressNodeZip(params) {
  params['message']('start decompress node and npm...');
  let zipReadStream = fs.createReadStream(params['nodePath']);
  zipReadStream.pipe(unzip.Extract({path:params['outputPath']})).on('finish',function(){
    params['message']('end decompressed!');
    stepCopyCommand(params);
  });
}
function stepCopyCommand(params) {
  fs.mkdirsSync(params['npmDependDir']);
  while((!fs.existsSync(params['nodeToPath']))&&fs.existsSync(params['nodeFromPath'])) {
    params['message']('copying node...');
    fs.copySync(params['nodeFromPath'],params['nodeToPath']);
    if(fs.existsSync(params['nodeToPath'])) {
      params['message']('end copy node.');
    }
  }
  while((!fs.existsSync(params['npmLibToPath']))&&fs.existsSync(params['npmLibFromPath'])) {
    params['message']('copying npm library...');
    fs.copySync(params['npmLibFromPath'],params['npmLibToPath']);
    if(fs.existsSync(params['npmLibToPath'])) {
      params['message']('end copy node library.');
    }
  }
  while((!fs.existsSync(params['npmBinToPath']))&&fs.existsSync(params['npmBinFromPath'])) {
    params['message']('copying npm binary...');
    fs.copySync(params['npmBinFromPath'],params['npmBinToPath']);
    if(fs.existsSync(params['npmBinToPath'])) {
      params['message']('end copy npm binary.');
    }
  }
  while((!fs.existsSync(params['npmModuleToPath']))&&fs.existsSync(params['npmModuleFromPath'])) {
    params['message']('copying npm node_modules...');
    fs.copySync(params['npmModuleFromPath'],params['npmModuleToPath']);
    if(fs.existsSync(params['npmModuleToPath'])) {
      params['message']('end copy npm node_modules.');
    }
  }
  while((!fs.existsSync(params['npmPackageToPath']))&&fs.existsSync(params['npmPackageFromPath'])) {
    params['message']('copying npm package.json...');
    fs.copySync(params['npmPackageFromPath'],params['npmPackageToPath']);
    if(fs.existsSync(params['npmPackageToPath'])) {
      params['message']('end copy npm package.json.');
    }
  }
  params['callback'](
    fs.existsSync(params['nodeToPath'])&&
    fs.existsSync(params['npmLibToPath'])&&
    fs.existsSync(params['npmBinToPath'])&&
    fs.existsSync(params['npmModuleToPath'])&&
    fs.existsSync(params['npmPackageToPath'])
  );
}
function nothing(arg) {}
function put(func) {
  if(func) {
    return func;
  }
  return nothing;
}
