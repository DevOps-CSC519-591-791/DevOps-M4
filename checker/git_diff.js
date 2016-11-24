var git = require('simple-git')(__dirname+'/../../solar-calc');

// console.log(simpleGit.branch());
git.listRemote(['--get-url'], function(err, data) {
            if (!err) {
                console.log('Remote url for repository at solar-clac:');
                console.log(data);
            }
        });

git.diffSummary(function(err,data){
	console.log('the diffs:');
	console.log(data);
});


git.diff(['src/moon.js'], function(err,data){
	console.log('the diffs:');
	console.log(data);
});
