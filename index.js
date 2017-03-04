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
 .option('-d, --username <directory>', 'The user to authenticate as')
 .option('-p, --password <password>', 'The user\'s password')
 .action(function() {
 });

program
  .command('setup [path]')
  .action(function(pathToCssDir){
    mkdirp(`${pathToCssDir}/css`, function(err) {
        const filesToSave = [];
        const toSave = helpers.getToSave(filesToSave);          

        files.forEach(file => {
            fs.writeFile(`${pathToCssDir}/css/${file}.css`, "", function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 
        });

        let lines = files.map(file => `@import url('${file}.css');`).join('\r');

        fs.writeFile(`${pathToCssDir}/css/application.css`, lines, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });

    });
  });

program
  .command('compile [path]')
  .action(function(pathToCssDir){
      largeFunction();
    //   process.cwd();
  });  

program
  .command('lump [path]')
  .action(function(pathToCssDir){
      walkFunction();
    //   process.cwd();
  });    

  program.parse(process.argv);
