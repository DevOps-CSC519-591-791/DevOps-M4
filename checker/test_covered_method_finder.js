var readline = require('linebyline');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var S = require('string');

var appDir = __dirname + '/../../solar-calc/';
var sourceFileArr = ['moon.js', 'solarCalc.js', 'sun.js'];

function main(){
	var separatedTestFolder = appDir + 'separated_tests/';
	fs.readdir(separatedTestFolder, function(err, files){
		files.forEach(function(testFileName){
			// ./node_modules/.bin/istanbul cover --report json ./node_modules/.bin/_mocha separated_tests/test_3.rb
			var command = './node_modules/.bin/istanbul cover --report json ./node_modules/.bin/_mocha separated_tests/' + testFileName;
			var child = exec(command, {cwd: appDir}, function(error, stdout, stderr){
				if(error) { throw error; }
				var jsonFilePath = appDir + 'coverage/coverage-final.json';
				var jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
				parseIstanbulOutput(testFileName, jsonContent);
			});
		});
	});
}

function parseIstanbulOutput(testFileName, jsonContent){
	sourceFileArr.forEach(function(sourceFile){
		// one source file statement/branch/function coverage info
		// function coverage info
		var key = S(__dirname).replaceAll('DevOps-M4/checker', 'solar-calc/lib/') + sourceFile;
		var funcCoverage = jsonContent[key]['f'];

		var coveredFunc = [];
		for(var num in funcCoverage){
			if(funcCoverage[num] > 0) { coveredFunc.push(num); }
		}
		console.log(testFileName + '-' + sourceFile + ': ' + coveredFunc);
	});
}

main();