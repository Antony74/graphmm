// usage: node dot2svg.js

// Configuration

var inDir = __dirname + '/output/dot/';
var outDir = __dirname + '/output/svg/';
var nConcurrent = 8;
var nMaxDotFileSize = 1024 * 1024; // https://gitlab.com/graphviz/graphviz/issues/1127

// End of configuration

var fs = require('fs');
var exec = require('child_process').exec;

fs.readdir(inDir, (err, files) => {

  function convert() {
    if (files.length) {
      var dotfile = files.shift();

      fs.stat(inDir + dotfile, (error, stats) => {
        if (error) {
          console.log(error);
          process.exit(1);
        } else if (stats.size > nMaxDotFileSize) {
          console.log(['Skipping ', dotfile, 'max size exceeded'].join(''));
          convert();
        } else {
          var arr = dotfile.split('.');
          arr[arr.length - 1] = 'svg';
          var svgfile = arr.join('.');
          var cmd = ['dot ', inDir, dotfile, ' -Tsvg -o ', outDir, svgfile].join('');
    
          exec(cmd, (error, stdout, stderr) => {
            if (error) {
              console.log(error);
              process.exit(1);
            }
            if (stdout) {
              console.log(stdout);
            }
            if (stderr) {
              console.log(stderr);
              process.exit(1);
            }
    
            convert();
          });
        } 
      });
    }
  }

  for (var n = 0; n < nConcurrent; ++n) {
    convert();
  }
});

