#!/usr/bin/env node

// console.log('HELLOE WORLD!!!');
const fs = require('fs');
const path = require('path');
var program = require('commander');
var mkdirp = require('mkdirp');
var request = require('request');
var mkdirp = require('mkdirp');
var helpers = require('./helpers');
var largeFunction = require('./add_styles').largeFunction;
var walkFunction = require('./add_styles').walkFunction;
// const shell = require('shelljs');

var pathToCssDir;
const remoteTemplatesPath = 'https://raw.githubusercontent.com/robertschneiderman/rapidCSS/master/css_templates';


program
.command('register [component]')
.action(function(component){
  component = component || 'banana';
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

function pullFileFromWeb(name) {
  if (!fs.existsSync(`${pathToCssDir}/${name}.css`)) request(`${cssTemplatesPath}/${name}.css`).pipe(fs.createWriteStream(`${pathToCssDir}/${name}.css`));
}

program
.command('setup [path]')
.action(function(pathToCssDir){
  pathToCssDir = pathToCssDir ? `${pathToCssDir}/css` : 'css';
  // let flexboxGridPath = 'https://raw.githubusercontent.com/kristoferjoseph/flexboxgrid/master/src/css/flexboxgrid.css';
  mkdirp(`${pathToCssDir}`, function(err) {
    pullFileFromWeb('application');
    pullFileFromWeb('normalize');
    pullFileFromWeb('defaults');
    // mkdirp(`${pathToCssDir}/layout`, function(err) {});
    // if (!fs.existsSync(`${pathToCssDir}/layout/grid.css`)) request(flexboxGridPath).pipe(fs.createWriteStream(`${pathToCssDir}/layout/grid.css`));
    mkdirp(`${pathToCssDir}/modules`, function(err) {});      
    pullFileFromWeb('modules/index');
    
    console.log("Project Setup!");
  });
}); 

program
  .command('compile [inputPath] [outputPath]')
  .option('-d, --directory <directory>', 'Directory to start recursive find')
  .option('-t, --target <target>', 'Target CSS Attribute')
  .option('-e, --extensions <extensions>', 'Extentions to search through')
  .action(function(inputPath, outputPath, options){
    let directory = options.directory || '';
    let target = options.target || "class";
    let extensions = options.extensions || '*';

    walkFunction(inputPath, outputPath, {directory, target, extensions});
    console.log("Code compiled");
});    



  program.parse(process.argv);
