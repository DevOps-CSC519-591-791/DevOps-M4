var fs = require("fs");
var exec = require('child_process').exec;
var gitDiff = require('./git_diff.js');

var filePath = '';
var lineNum = 0;
var command = '';
var changedMethod = [];

function changedMethodFinder(callback){
	gitDiff.diff_the_project([], function(diffinfo){
		diffinfo.forEach(function(info){
			// console.log(info);
			if(!(info['file'] === '/dev/null') && info['type'] === 'add'){

				if (changedMethod.indexOf(info['file']) == -1){
					changedMethod.push(info['file']);
				}
				
				filePath = __dirname + '/../../solar-calc/' + info['file'];
				lineNum = info['ln'];

				// console.log(filePath + ':' + lineNum);
				command = 'node method_finder.js ' + filePath + ':' + lineNum;
				exec(command, function(err, stdout, stderr){
					if (err) { throw err; }
					changedMethod.push(stdout.replace(/\n/, ''));
					// console.log(stdout);
					callback(changedMethod);
				});
			}
		});
	});
}

changedMethodFinder(function(changedMethod){
	console.log(changedMethod);
	fs.writeFile(__dirname + '/../results/commit_changed_method', changedMethod.toString(), function (err) {
		  if (err) { throw err; }
	});
})
