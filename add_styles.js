'use strict';
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const helpers = require('./helpers');
const fs = require('fs');
const walk    = require('walk');

const args = process.argv;
// let inputPath = args[2];
const CLASS_TYPES = require('./class_types').CLASS_TYPES;


const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

// sanitize output

const getClassNamesFromFiles = (filePaths, options) => {
  let classNames = [];
  let { extensions, target } = options;
  extensions = extensions.split(", ");

  for (let i = 0; i < filePaths.length; i++) {
    let filePath = filePaths[i];
    // console.log('filePath: ', filePath);
    let ext = filePath.match(/\.(.*)/) && filePath.match(/\.(.*)/)[1];
    if (!extensions.includes('*') && !extensions.includes(ext)) continue;

    let lines = helpers.getLines(`${filePath}`);
    lines.forEach(line => {
      let regex;
      if (target === "class") regex = /class=\"([^"]*)\"|class=\`([^`]*)`/g;
      if (target === "className") regex = /className=\"([^"]*)\"|className=\`([^`]*)`/g;            
      
      let result = regex[Symbol.match](line);
      // console.log('result: ', result);
      if (result) {
        result.forEach(className => {
            className = className.slice(target.length + 2);
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
  addClass(i, lines, className);
};

const handleContainer = (lines, className) => {
  let i = helpers.lineIndex(lines, / Small /);
  addClass(i, lines, className);  
  i = helpers.lineIndex(lines, / Medium /);
  addIndentedClass(i, lines, className);  
  i = helpers.lineIndex(lines, / Large /);
  addIndentedClass(i, lines, className); 
  i = helpers.lineIndex(lines, / xLarge /);
  addIndentedClass(i, lines, className);      
};

const addClass = (i, lines, className) => {
  lines.splice(i, 0, `.${className} {`);
  lines.splice(i+1, 0, ``);
  lines.splice(i+2, 0, `}`);
};

const addIndentedClass = (i, lines, className) => {
  lines.splice(i, 0, `    .${className} {`);
  lines.splice(i+1, 0, `        `);
  lines.splice(i+2, 0, `    }`);
};

const walkFunction = (inputPath, outputPath, options) => {
  const inputDir = process.cwd() + '/' + inputPath;

  console.log('inputDir: ', inputDir);
  // console.log('outputPath: ', outputPath);

  // console.log('options.directory: ', options.directory);
  // console.log('inputDir: ', inputDir);

  var files   = [];
  var walker  = walk.walk(inputDir, { followLinks: false });

  walker.on('file', function(root, stat, next) {
    files.push(root + '/' + stat.name);
    next();
  });

  walker.on('end', function() {
    let classNames = getClassNamesFromFiles(files, options);

    // console.log('classNames: ', classNames);

    classNames.forEach(className => {
      let classType = /[^-]*/g[Symbol.match](className)[0];
      let cssFileName = CLASS_TYPES[classType];

      let cssFile;
      if (cssFileName) cssFile = path.join(process.cwd(), `${outputPath}/${cssFileName}.css`);
      if (cssFile) {
        let lines = helpers.getLines(cssFile);

        let regex = new RegExp("^." + className + " ");
        let alreadyContainsClass = lines.some(line => regex.test(line));

        if (!alreadyContainsClass) {
          console.log('className: ', className);
          (classType === 'c') ?
          handleContainer(lines, className) :
          addToEndOfFile(lines, className);

          toSave(cssFile, lines);
          helpers.saveFiles(filesToSave);
        }
      }
    });
    console.log('Save files');
  });
};

exports.walkFunction = walkFunction;