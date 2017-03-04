#!/usr/bin/env node

// console.log('HELLOE WORLD!!!');
const fs = require('fs');
const path = require('path');
var program = require('commander');
var mkdirp = require('mkdirp');
var files = require('./class_types').files;
var helpers = require('./helpers');
// const shell = require('shelljs');

program
 .option('-d, --username <directory>', 'The user to authenticate as')
 .option('-p, --password <password>', 'The user\'s password')
 .action(function() {
 });

program
  .command('setup [path]')
  .action(function(pathToCssDir){
    // var mode = options.setup_mode || "normal";
    console.log('pathToCssDir: ', pathToCssDir);
    // console.log('process.cwd(): ', process.cwd());
    // env = env || 'all';
    // console.log('setup for %s env(s) with %s mode', env, mode);

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


// lines = helpers.getLines(targetPath);
// i = helpers.lastLineIndex(lines, /^import /);
// lines.splice(i + 1, 0, `import ${context.CAMEL_PAGE_NAME}Reducer from '../pages/${context.CAMEL_PAGE_NAME}/redux/reducer';`);
// i = helpers.lastLineIndex(lines, /^\}\);$/);
// lines.splice(i, 0, `  ${context.CAMEL_PAGE_NAME}: ${context.CAMEL_PAGE_NAME}Reducer,`);


  });

  program.parse(process.argv);
