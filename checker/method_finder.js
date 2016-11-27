var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");
var readline = require('linebyline');

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["method_finder.js:34"];
	}
	args = args[0].split(':');
	var filePath = args[0];
	var lineNum = args[1];
	
	complexity(filePath, lineNum);

	// Report
	for( var node in builders )
	{
		var builder = builders[node];
		builder.report();
	}
}

var builders = {};

// Represent a reusable "class" following the Builder pattern.
function ComplexityBuilder()
{
	this.StartLine = 0;
	this.FunctionName = "";
	// The content of the method containing certain line.
	this.MethodContent = "";

	this.report = function()
	{
		console.log(
		   (
			"{0}(): {1} ~ {2}\n" +
			"============\n" +
				"MethodContent: {3}\n"
			)
			.format(this.FunctionName, this.StartLine, this.EndLine, this.MethodContent)
		);
	}
};

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
	var key, child;

	visitor.call(null, object);

	for (key in object) {
		if (object.hasOwnProperty(key)) {
			child = object[key];
			if (typeof child === 'object' && child !== null && key != 'parent') 
			{
				child.parent = object;
					traverseWithParents(child, visitor);
			}
		}
	}
}

function complexity(filePath, lineNum)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);

	var i = 0;
	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (node) 
	{
		if (node.type === 'FunctionDeclaration' || node.type === 'MethodDefinition') 
		{
			var builder = new ComplexityBuilder();

			builder.FunctionName = functionName(node, node.type);
			builder.StartLine    = node.loc.start.line;
			builder.EndLine 	 = node.loc.end.line;

			// if certain line number located between one methods' start line and end line
			// print the line number and lines of this method
			if (lineNum >= builder.StartLine && lineNum <= builder.EndLine)
			{
				file = readline(filePath);
				file.on('line', function(line, lineCount, byteCount) {
					if (lineCount >= builder.StartLine && lineCount <= builder.EndLine)
					{
						console.log(("{0}: {1}").format(lineCount, line));
						builder.MethodContent += (line + '\n');
					}
			 	}).on('error', function(e) {
					throw e;
				});

				builders[builder.FunctionName] = builder;
			}
		}
	});
}

// Helper function for printing out function name.
function functionName( node, type )
{
	if( type === 'FunctionDeclaration' && node.id )
	{
		return node.id.name;
	}
	if( type === 'MethodDefinition' && node.key ){
		return node.key.name;
	}
	return "anon function @" + node.loc.start.line;
}

// Helper function for allowing parameterized formatting of strings.
if (!String.prototype.format) {
  String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) { 
	  return typeof args[number] != 'undefined'
		? args[number]
		: match
	  ;
	});
  };
}

main();