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


const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);


const inputDir = process.cwd() + '/sample_project';

const getClassNamesFromFiles = filePaths => {
    let classNames = [];
    for (let i = 0; i < filePaths.length; i++) {
        let filePath = filePaths[i];
        let ext = filePath.match(/\.(.*)/)[1];
        if (ext !== 'html') continue;
        let lines = helpers.getLines(`${filePath}`);
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
    return classNames;  
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

const walkFunction = () => {

    var files   = [];
    var walker  = walk.walk(inputDir, { followLinks: false });

    walker.on('file', function(root, stat, next) {
        files.push(root + '/' + stat.name);
        next();
    });

    walker.on('end', function() {
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
                    console.log('className: ', className);
                    addToEndOfFile(lines, className);

                    toSave(outputPath, lines);
                    helpers.saveFiles(filesToSave);
                }
            }
        });
        console.log('Save files');
    });
};

exports.walkFunction = walkFunction;