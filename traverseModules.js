'use strict';
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const helpers = require('./helpers');
const fs = require('fs');
const walk    = require('walk');

const args = process.argv;
// let inputPath = args[2];


const filesToSave = [];
const defaultExtensions = ['html'];
const toSave = helpers.getToSave(filesToSave);

// sanitize output

const getClassNamesFromFiles = (filePaths, options) => {
  let classNames = [];
  // let { extensions, target } = options;
  // extensions = defaultExtensions;

  for (let i = 0; i < filePaths.length; i++) {
    let filePath = filePaths[i];
    // console.log('filePath: ', filePath);
    // let periodSeparated = filePath.split('.');
    // let ext = periodSeparated[periodSeparated.length-1];
    // if (!extensions.includes(ext)) continue;

    let lines = helpers.getLines(`${filePath}`);
    lines.forEach(line => {
      let regex = /class=\"([^"|\s]*)/g,
          match;
      
      while (match = regex.exec(line)) {
        let result = match && match[1];
        if (result) {
          classNames.push(result);
        }
      }
    });
  }
  return classNames;
};

const handleContainer = (lines, className) => {
  let i = helpers.lineIndex(lines, / Small /);
  helpers.addClass(i, lines, className);  
  i = helpers.lineIndex(lines, / Medium /);
  addIndentedClass(i, lines, className);  
  i = helpers.lineIndex(lines, / Large /);
  addIndentedClass(i, lines, className); 
  i = helpers.lineIndex(lines, / xLarge /);
  addIndentedClass(i, lines, className);
};

const addIndentedClass = (i, lines, className) => {
  lines.splice(i, 0, `    .${className} {`);
  lines.splice(i+1, 0, `        `);
  lines.splice(i+2, 0, `    }`);
};

const traverseModules = (inputPath, outputPath, options) => {
  const inputDir = process.cwd() + '/' + inputPath;

  var files   = [];
  var walker  = walk.walk(inputDir, { followLinks: false });

  walker.on('file', function(root, stat, next) {
    files.push(root + '/' + stat.name);
    next();
  });

  walker.on('end', function() {
    let classNames = getClassNamesFromFiles(files, options);

    classNames.forEach(className => {
      let moduleName = /[^-]*/g[Symbol.match](className)[0];
      let modulePath = path.join(process.cwd(), `${outputPath}/modules/${moduleName}.css`);

      if (!fs.existsSync(modulePath)) return;

      let lines = helpers.getLines(modulePath);

      let regex = new RegExp("^." + className + " ");
      let alreadyContainsClass = lines.some(line => regex.test(line));

      if (!alreadyContainsClass) {
        console.log('className: ', className);
        helpers.addClassToEndofFile(lines, className);

        toSave(modulePath, lines);
        helpers.saveFiles(filesToSave);
      }
    });
    console.log('Save files');
  });
};

// exports.traverseModules = traverseModules;
exports.getClassNamesFromFiles = getClassNamesFromFiles;