'use strict';
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const helpers = require('./helpers');
const fs = require('fs');
const walk    = require('walk');

const args = process.argv;
let inputPath = args[2];
const CLASS_TYPES = require('./class_types').CLASS_TYPES;
// const arr = (args[2] || '').split('/');
// const pageName = arr[0];
// const componentName = arr[1];


const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);


const inputDir = process.cwd() + '/sample_project';

const getClassNamesFromFiles = files => {
    let classNames = [];
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let ext = file.match(/\.(.*)/)[1];
        if (ext !== 'html') continue;
        let lines = helpers.getLines(`${inputDir}/${file}`);
        // console.log('lines: ', lines);

        lines.forEach(line => {
            let regex = /class=\"([^"]*)\"|class=\`([^`]*)`/g;
            let result = regex[Symbol.match](line);
            if (result) {
                result.forEach(className => {
                    className = className.slice(7);
                    className = className.slice(0, className.length-1);
                    className.split(" ").forEach(cN => {
                    classNames.push(cN); 
                    });
                });
            }
        });
    }    
};

const addToEndOfFile = (lines, className) => {
    let i;
    if (lines.length === 1 && lines[0] === '') { // file empty
        i = 0;
    } else {
        i = helpers.lastLineIndex(lines, /^}/) + 1;
    }
    lines.splice(i, 0, `.${className} {`);
    lines.splice(i+1, 0, ``);
    lines.splice(i+2, 0, `}`);    
};


const largeFunction = () => {

    if (inputPath) {
        fs.readdir(inputDir, (err, files) => {
            
            let classNames = getClassNamesFromFiles(files);

            classNames.forEach(className => {
                let classType = /[^-]*/g[Symbol.match](className)[0];
                let cssFileName = CLASS_TYPES[classType];

                let outputPath;
                if (cssFileName) outputPath = path.join(process.cwd(), `static/css/${cssFileName}.css`);
                if (outputPath) {
                    let lines = helpers.getLines(outputPath);

                    let regex = new RegExp("^." + className + " ");
                    let alreadyContainsClass = lines.some(line => regex.test(line));

                    if (!alreadyContainsClass) {
                        addToEndOfFile(lines, className);


                        // console.log('outputPath: ', outputPath);
                        toSave(outputPath, lines);
                        helpers.saveFiles(filesToSave);
                    }
                }
            });


        });
    }
};


exports.largeFunction = largeFunction;

// var files   = [];

// // Walker options
// var walker  = walk.walk(helpers.getProjectRoot() + `src/pages/newTask`, { followLinks: false });

// walker.on('file', function(root, stat, next) {
//     // Add this file to the list of files
//     files.push(root + '/' + stat.name);
//     next();
// });

// walker.on('end', function() {
//     console.log(files);
// });