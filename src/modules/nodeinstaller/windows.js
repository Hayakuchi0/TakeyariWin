const wget = require('node-wget');
const path = require('path');
const fs = require('fs-extra');
exports.nodeInstall = function(downloadZipDir, outputDir, projectDir, callback) {
	let result = false;
	let params = {};
	params['callback'] = callback;
	params['nodeVersion'] = '8.10.0';
	params['nodeBaseName'] = 'node-v'+params['nodeVersion']+'-win-'+process.arch;
	params['nodeName'] = params['nodeBaseName'] + '.zip';
	params['nodeUrl'] = 'https://nodejs.org/dist/v'+params['nodeVersion']+'/'+params['nodeName'];
	params['nodePath'] = path.join(downloadZipDir,params['nodeName']);
	params['outputPath']  = path.join(outputDir,'output');
	params['fromCopyDirectory'] = path.join(params['outputPath'],params['nodeBaseName']);
	if(true) {
		if(fs.existsSync(params['outputPath'])) {
			stepCopyCommand(params);
		} else {
			if(fs.existsSync(params['nodePath'])) {
				stepDecompressNodeZip(params);
			}
			else {
				stepWgetNode(params)
			}
		}
	} else {
		callbackParam(params,true);
	}
}
async function stepWgetNode(params) {
	console.log('start download!');
	await wget({url:params['nodeUrl'],dest:params['nodePath']}, async function(error, response, body) {
		if(error) {
			console.log(error);
			callbackParam(params,false);
		} else {
			console.log('end download!');
			await stepDecompressNodeTarxz(params);
		}
	});
}
async function stepDecompressNodeZip(params) {
// まだ
}
function stepCopyCommand(params) {
// まだ
}
function callbackParam(params,result) {
	if(params['callback']) {
		params['callback'](result);
	}
}
