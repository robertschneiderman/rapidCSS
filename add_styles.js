'use strict';
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const helpers = require('./helpers');
const fs = require('fs');
const walk    = require('walk');

const args = process.argv;
let inputPath = args[2];
// const arr = (args[2] || '').split('/');
// const pageName = arr[0];
// const componentName = arr[1];


const CLASS_TYPES = {
    btn: 'buttons',
    chars: 'characters',
    c: 'containers',
    form: 'forms',
    hl: 'headlines',
    icn: 'icons',
    img: 'images',
    input: 'inputs',
    item: 'items',
    label: 'labels',
    link: 'links',
    list: 'lists',
    modal: 'modals',
    nav: 'navs',
    p: 'pages',
    panel: 'panels',
    r: 'rows',
    shape: 'shapes',
    text: 'texts',
    title: 'titles',
    w: 'wrappers'
};

const filesToSave = [];
const toSave = helpers.getToSave(filesToSave);

if (inputPath) {
    console.log('args[2]: ', args[2]);
    const targetDir = helpers.getProjectRoot() + `src/` + `${inputPath}`;

    fs.readdir(targetDir, (err, files) => {
        let classNames = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let ext = file.match(/\.(.*)/)[1];
            if (ext !== 'jsx') continue;
            let lines = helpers.getLines(`${targetDir}/${file}`);
            lines.forEach(line => {
                let regex = /className=\"([^"]*)\"|className=\`([^`]*)`/g;
                let result = regex[Symbol.match](line);
                if (result) {
                    result.forEach(className => {
                        className = className.slice(11);
                        className = className.slice(0, className.length-1);
                        className.split(" ").forEach(cN => {
                           classNames.push(cN); 
                        });
                    });
                }
            });
        }

        classNames.forEach(className => {
            let classType = /[^-]*/g[Symbol.match](className)[0];
            let cssFileName = CLASS_TYPES[classType];

            let targetPath;
            if (cssFileName) targetPath = path.join(helpers.getProjectRoot(), `static/css/${cssFileName}.css`);
            if (targetPath) {
                let lines = helpers.getLines(targetPath);

                let regex = new RegExp("^." + className + " ");
                let alreadyContainsClass = lines.some(line => regex.test(line));
                // if (cssFileName === 'containers') console.log('className: ', className);
                // console.log('regex: ', regex);
                // console.log('lines: ', lines);
                // console.log('className: ', className);
                // // if (className === 'btn-choose-color') console.log('alreadyContainsClass: ', alreadyContainsClass);
                // // if (className === 'btn-choose-color') console.log('cssFileName: ', cssFileName);
                if (className === 'input-goal') console.log('alreadyContainsClass: ', alreadyContainsClass);
                if (className === 'input-goal') console.log('cssFileName: ', cssFileName);
                if (!alreadyContainsClass) {
                    console.log('className: ', className);
                    let i;
                    if (lines.length === 1 && lines[0] === '') { // file empty
                        i = 0;
                    } else {
                        i = helpers.lastLineIndex(lines, /^}/) + 1;
                    }
                    lines.splice(i, 0, `.${className} {`);
                    lines.splice(i+1, 0, ``);
                    lines.splice(i+2, 0, `}`);


                    // console.log('targetPath: ', targetPath);
                    toSave(targetPath, lines);
                    helpers.saveFiles(filesToSave);
                }
            }
        });


    });
}




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