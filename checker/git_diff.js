var git = require('simple-git')(__dirname+'/../../solar-calc');
var parse = require('./diff-parse/lib/parse');

function diff_the_project(callback){
	var dict = [];
	git.diff(function(err,data){
		var files = parse(data);
		// console.log(files.length); // number of patched files
		files.forEach(function(file) {
			// console.log(file.from)
			file.lines.forEach(function(line){
				if(line.type == 'del'){
					// console.log(line);
					dict.push({file: file.from, type: 'del', ln: line.ln});
				}
			});

			file.lines.forEach(function(line){
				if(line.type == 'add'){
					// console.log(line);
					dict.push({file: file.from, type: 'add', ln: line.ln});
				}
			});
		});
		callback(dict);
	});
}

diff_the_project(function(diffinfo){
	diffinfo.forEach(function(info){
		console.log(info);
	});
});