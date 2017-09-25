#!/usr/bin/env node

// console.log('HELLOE WORLD!!!');
const fs = require('fs');
const path = require('path');
var program = require('commander');
var mkdirp = require('mkdirp');
var request = require('request');
var helpers = require('./helpers');
var largeFunction = require('./add_styles').largeFunction;
var walkFunction = require('./add_styles').walkFunction;
// const shell = require('shelljs');

const createTemplateFile = () => {
  
};

program
.command('register [component]')
.action(function(component){
  component = component || 'aaaple';
  var pathToCssDir = './css'; // make dynamic!
  var fullPath = `${pathToCssDir}/${component}.css`;
  var modulesIndexPath = `${pathToCssDir}/modules/index.css`;  

  if (!fs.existsSync(fullPath)) {
    fs.writeFile(fullPath, "", function(err) {
      if(err) {
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

  console.log("Project Setup!");
}); 

program
.command('setup [path]')
.action(function(pathToCssDir){
  pathToCssDir = pathToCssDir ? `${pathToCssDir}/css` : 'css';
  mkdirp(`${pathToCssDir}`, function(err) {
    let cssTemplatesPath = 'https://raw.githubusercontent.com/robertschneiderman/rapidCSS/master/css_templates';
    if (!fs.existsSync(`${pathToCssDir}/application.css`)) request(`${cssTemplatesPath}/application.css`).pipe(fs.createWriteStream(`${pathToCssDir}/application.css`));
    request(`${cssTemplatesPath}/normalize.css`).pipe(fs.createWriteStream(`${pathToCssDir}/normalize.css`));
    if (!fs.existsSync(`${pathToCssDir}/defaults.css`)) request(`${cssTemplatesPath}/defaults.css`).pipe(fs.createWriteStream(`${pathToCssDir}/defaults.css`));
    if (!fs.existsSync(`${pathToCssDir}/modules/index.css`)) request(`${cssTemplatesPath}/modules/index.css`).pipe(fs.createWriteStream(`${pathToCssDir}/modules/index.css`));

    console.log("Project Setup!");
  });
}); 

program
  .command('compile [inputPath] [outputPath]')
  .option('-d, --directory <directory>', 'Directory to start recursive find')
  .option('-t, --target <target>', 'Target CSS Attribute')
  .option('-e, --extensions <extensions>', 'Extentions to search through')
  .action(function(inputPath, outputPath, options){
  //   console.log('options.extensions: ', options.extensions);
    let directory = options.directory || '';
    let target = options.target || "class";
    let extensions = options.extensions || '*';

  //   let target = program.target || 'class';
    walkFunction(inputPath, outputPath, {directory, target, extensions});
  //   process.cwd();
});    



  program.parse(process.argv);
