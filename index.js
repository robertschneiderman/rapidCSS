#!/usr/bin/env node

// console.log('HELLOE WORLD!!!');
const fs = require('fs');
const path = require('path');
var program = require('commander');
var mkdirp = require('mkdirp');
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
                console.log("The file was saved!");
            }); 
          }
        });

        let lines = files.map(file => `@import url('${file}.css');`).join('\r');
        
        let fullPath = `${pathToCssDir}/application.css`;

        if (!fs.existsSync(fullPath)) {
          fs.writeFile(fullPath, lines, function(err) {
              if(err) {
                  return console.log(err);
              }
              console.log("The file was saved!");
          });
        }
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
