var fs = require("fs");

var jsonf = __dirname + "/../results/test_covered_methods.json";
if (fileExists(jsonf)){
	var contents = fs.readFileSync(jsonf);
	testCoveredMethods = JSON.parse(contents);
}else{
	testCoveredMethods = ""
}


function fileExists(filePath, callback)
{
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
}


// var testCoveredMethods = fs.readFileSync(__dirname + '/../results/test_covered_methods.json') <---- have problem!!
var iterator = 0
var fileName = ''
var touched = new Set()

fs.readFile(__dirname + '/../results/commit_changed_method', 'utf8', function (err,data) {
	if (err) {  throw err; }
	var methodArr = data.split(",");
	methodArr.forEach(function(methodName) {
		// the first 'methodName' is actually fileName
		if(iterator == 0){
			fileName = methodName.substring(4, methodName.len);
		} else {
			// console.log(testCoveredMethods[fileName][methodName]);
			testCoveredMethods[fileName][methodName].forEach(function(value){
				touched.add(value)
			})
			// console.log(touched)
		}
		iterator += 1;
	});

	// console.log(touched)
	var str = ''
	touched.forEach(function(val){
		str += val + ','
	})
	str = str.substring(0, str.lastIndexOf(','))

	// console.log(str)
	jsonf = __dirname + '/../results/commit_touched_testcases'
	fs.writeFile(jsonf, str, 'utf8', function(err, value){})
});


