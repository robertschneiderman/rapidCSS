#!/usr/bin/env node

// console.log('HELLOE WORLD!!!');
var program = require('commander');
const fs = require('fs');
var mkdirp = require('mkdirp');
const path = require('path');
var request = require('request');
const walk = require('walk');

var helpers = require('./helpers');
var traverseModules = require('./traverseModules').traverseModules;

var pathToCssDir;
const remoteTemplatesPath = 'https://raw.githubusercontent.com/robertschneiderman/rapidCSS/master/css_templates';

function pullFileFromWeb(name) {
  if (!fs.existsSync(`${pathToCssDir}/${name}`)) request(`${remoteTemplatesPath}/${name}`).pipe(fs.createWriteStream(`${pathToCssDir}/${name}`));
}

program
.command('setup [path]')
.action(function(pathToCssDirParam){
  pathToCssDir = pathToCssDirParam ? `${pathToCssDirParam}/css` : 'css';

  mkdirp(`${pathToCssDir}`, function(err) {
    var walker  = walk.walk('/node_modules/rapidcss/css_templates', { followLinks: false });

    walker.on('file', function(root, stat, next) {
      var path = root.replace('css_templates', pathToCssDir) + `/${stat.name}`;
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
.command('register [component]')
.action(function(component){
  var pathToCssDir = './css'; // make dynamic!
  var fullPath = `${pathToCssDir}/modules/${component}.css`;
  var modulesIndexPath = `${pathToCssDir}/modules/index.css`;  

  if (!fs.existsSync(fullPath)) {
    fs.writeFile(fullPath, "", function(err) {
      if (err) {
        return console.log(err);
      }
    }); 

    let lines = helpers.getLines(modulesIndexPath);
    helpers.addImportAlphabetically(lines, component);

    fs.writeFile(modulesIndexPath, lines.join("\n"), function(err) {
      if(err) {
          return console.log(err);
      }
    }); 
  }

  console.log(`${component} registered!`);
});

program
  .command('compile [inputPath] [outputPath]')
  .option('-d, --directory <directory>', 'Directory to start recursive find')
  .option('-t, --target <target>', 'Target CSS Attribute')
  .option('-e, --extensions <extensions>', 'Extentions to search through')
  .action(function(inputPath, outputPath, options) {
    let directory = options.directory || '';
    let target = options.target || "class";
    let extensions = options.extensions || '';

    traverseModules(inputPath, outputPath, {directory, target, extensions});
    console.log("Code compiled");
});    



program.parse(process.argv);
