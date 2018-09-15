#!/usr/bin/env node

var program = require('commander');
const fs = require('fs');
var mkdirp = require('mkdirp');
const path = require('path');
var request = require('request');
const walk = require('walk');

var helpers = require('./helpers');
var getClassNamesFromFiles = require('./traverseModules').getClassNamesFromFiles;

var pathToCssDir;
const remoteTemplatesPath = 'https://raw.githubusercontent.com/robertschneiderman/rapidCSS/master/css_templates';

function pullFileFromWeb(name) {
  if (!fs.existsSync(`${pathToCssDir}/${name}`)) request(`${remoteTemplatesPath}/${name}`).pipe(fs.createWriteStream(`${pathToCssDir}/${name}`));
}

program
.command('setup [pathToCssDir]')
.action(function(pathToCssDir){
  pathToCssDir = pathToCssDir || 'css';

  mkdirp(`${pathToCssDir}`, function(err) {
    var dirname = __dirname;
    var walker  = walk.walk(`${__dirname}/css_templates`, { followLinks: false });

    walker.on('file', function(root, stat, next) {
      var oneLevelUp = root.split("/").reverse()[0];
      var path = oneLevelUp === 'css_templates' ? `${pathToCssDir}/${stat.name}` : `${pathToCssDir}/${oneLevelUp}/${stat.name}`;
      var content = fs.readFileSync(root + '/' + stat.name, 'utf8');
      
      fs.writeFile(path, content, {flag: 'wx'}, function(err) {
        if (err) {
          console.warn(`${err.path} already exists! Looking for rapidCSS upgrade?`);
        }
      });
      next();
    });

    walker.on('directory', function(root, stat, next) {
      mkdirp(`${pathToCssDir}/${stat.name}`, function(err) {});
      next();
    });
    
    console.log("Project Setup!");
  });
});

program
  .command('compile [cssDirectory]')
  .option('-d, --directory <directory>', 'Directory to start recursive find')
  .option('-t, --target <target>', 'Target CSS Attribute')
  .option('-e, --extensions <extensions>', 'Extentions to search through')
  .action(function(cssDirectory, options) {

    cssDirectory = cssDirectory || 'assets/css';

    var dirname = __dirname;
    var walker  = walk.walk(`${__dirname}`, { followLinks: false });
    var htmlFilePaths = [];

    walker.on('file', function(root, stat, next) {
      var match = /\.(.+)/.exec(stat.name)
      var ext = match && match[1];

      if (/node_modules/.test(root) || ext !== 'html') {
        next();
        return false;
      }

      htmlFilePaths.push(root + '/' + stat.name);

      next();
    });

    walker.on('end', function() {
      var classNames = getClassNamesFromFiles(htmlFilePaths);

      classNames.forEach(function(className) {
        var regex = /^([^-|\s]*)/;
        var match = regex.exec(className);
        var componentName = match && match[1];

        if (componentName) {
          var fullPath = `${cssDirectory}/components/${componentName}.css`;

          try {
            fs.writeFileSync(fullPath, '', {flag: 'wx', encoding: 'utf8'});
          } catch {}

          var cssFile = fs.readFileSync(fullPath, 'utf8');
          var regex = new RegExp(className + ' ')
          var match = regex.test(cssFile);

          if (!match) {
            var data = `.${className} {\n\n}\n\n`

            fs.appendFileSync(fullPath, data);
          }

          var mainCssFile = fs.readFileSync(`${cssDirectory}/main.css`, 'utf8');
          var regex2 = new RegExp(`${componentName}.css`)
          var match2 = regex2.test(mainCssFile);

          if (!match2) {
            var importCss = `@import '${componentName}.css';\n`

            fs.appendFileSync(`${cssDirectory}/main.css`, importCss);
          }
        }
      });
    });
    
    console.log("Code compiled");
});

program.parse(process.argv);
