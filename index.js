#!/usr/bin/env node

// console.log('HELLOE WORLD!!!');
const fs = require('fs');
const path = require('path');
var program = require('commander');
var mkdirp = require('mkdirp');
var request = require('request');
var files = require('./class_types').files;
var helpers = require('./helpers');
var largeFunction = require('./add_styles').largeFunction;
var walkFunction = require('./add_styles').walkFunction;
// const shell = require('shelljs');

program
  .command('setup [path]')
  .action(function(pathToCssDir){
    pathToCssDir = pathToCssDir ? `${pathToCssDir}/css` : 'css';
    mkdirp(`${pathToCssDir}`, function(err) {
        const filesToSave = [];
        const toSave = helpers.getToSave(filesToSave);          

        files.forEach(file => {
          let fullPath = `${pathToCssDir}/${file}.css`;
          
          if (!fs.existsSync(fullPath)) {
            fs.writeFile(fullPath, "", function(err) {
                if(err) {
                    return console.log(err);
                }
            }); 
          }
        });

        if (!fs.existsSync(`${pathToCssDir}/application.css`)) request('https://raw.githubusercontent.com/robertschneiderman/rapidCSS/master/css_templates/application.css').pipe(fs.createWriteStream(`${pathToCssDir}/application.css`));
        request('https://raw.githubusercontent.com/robertschneiderman/rapidCSS/master/css_templates/normalize.css').pipe(fs.createWriteStream(`${pathToCssDir}/normalize.css`));
        if (!fs.existsSync(`${pathToCssDir}/defaults.css`)) request('https://raw.githubusercontent.com/robertschneiderman/rapidCSS/master/css_templates/defaults.css').pipe(fs.createWriteStream(`${pathToCssDir}/defaults.css`));


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

  program
  .command('temp')
  .action(function(){
    request('https://raw.githubusercontent.com/robertschneiderman/tracking_app/master/static/css/normalize.css').pipe(fs.createWriteStream('normalize.css'));
  });    





  program.parse(process.argv);
