var options = {
    node: true,
    predef: [
            "jasmine",
            "describe",
            "it",
            "expect",
            "beforeEach"
    ]
};

var ANSIColors = {
  pass:    function() { return '\033[32m'; }, // Green
  fail:    function() { return '\033[31m'; }, // Red
  neutral: function() { return '\033[0m';  }  // Normal
};

var stringWithColor = function(str, color) {
    return (color || ANSIColors.neutral()) + str + ANSIColors.neutral();
  }

var fs = require('fs'),
        sys = require('sys'),
        dirName = process.argv[2],
        readFile = function (name) {
            return fs.readFileSync(name).toString();
        },
        print = function (message) {
            sys.puts(message);
        },
        quit = function (code) {
            process.exit(code)
        },
        jslint = require('./jslint');


if (!dirName) {
    print("Usage: jslint.js directory");
    quit(1);
}

fs.readdir(process.cwd() + "/" + dirName, function(err, list) {
    list.forEach(function (file) {
        var fileExtension = file.substr(file.length - 3);
        if (fileExtension === ".js") {
            doLint(dirName + "/" + file);
        }
    });
});

var doLint = function(fileName) {
    var e,i,input;
    input = readFile(fileName);
    if (!input) {
        print(stringWithColor("jslint: Couldn't open file '" + fileName + "'.", ANSIColors.fail()));
        quit(1);
    }
    if (!jslint.JSLINT(input, options)) {
        print(stringWithColor("Problems in " + fileName, ANSIColors.fail()));
        for (i = 0; i < jslint.JSLINT.errors.length; i += 1) {
            e = jslint.JSLINT.errors[i];
            if (e) {
                print('Lint at line ' + e.line + ' character ' +
                        e.character + ': ' + e.reason);
                print((e.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
                print('');
            }
        }
    } else {
        print(stringWithColor("jslint: No problems found in " + fileName, ANSIColors.pass()));
    }
};
