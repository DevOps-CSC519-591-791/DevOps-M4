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

// diff_the_project(['5d425c8d6072fcb87512c16233057abc775ed6e4', '031667c4464c6812e9884057992d80d462b045a5'],function(diffinfo){
// 	diffinfo.forEach(function(info){
// 		console.log(info);
// 	});
// });
