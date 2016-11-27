var git = require('simple-git')(__dirname + '/../../solar-calc');
var parse = require('diff-parse');

this.diff_the_project = function (diffargs, callback){
	var dict = [];
	// get the diff for all file in the current repo compared to the last commit
	git.diff(diffargs, function(err,data){
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

// diff_the_project(['24892ac078a1bfc6e91eff6edccaa0903b2ee403'], function(diffinfo){
// 	diffinfo.forEach(function(info){
// 		console.log(info);
// 	});
// });