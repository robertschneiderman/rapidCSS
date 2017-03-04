#!/usr/bin/env node

// console.log('HELLOE WORLD!!!');
const fs = require('fs');
var program = require('commander');
var mkdirp = require('mkdirp');
var CLASS_TYPES = require('./class_types').CLASS_TYPES;
// const shell = require('shelljs');

program
 .option('-d, --username <directory>', 'The user to authenticate as')
 .option('-p, --password <password>', 'The user\'s password')
 .action(function() {
 });

program
  .command('setup [path]')
  .action(function(path){
    // var mode = options.setup_mode || "normal";
    console.log('path: ', path);
    // console.log('process.cwd(): ', process.cwd());
    // env = env || 'all';
    // console.log('setup for %s env(s) with %s mode', env, mode);

    mkdirp(`${path}/css`, function(err) {

    'buttons',
    'characters',
    'containers',
    'forms',
    'headlines',
    'icons',
    'images',
    'inputs',
    'items',
    'labels',
    'links',
    'lists',
    'modals',
    'navs',
    'pages',
    panel: 'panels',
    r: 'rows',
    shape: 'shapes',
    text: 'texts',
    title: 'titles',
    w: 'wrappers'        

        fs.writeFile("/tmp/test", "Hey there!", function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 

    });



  });

  program.parse(process.argv);
