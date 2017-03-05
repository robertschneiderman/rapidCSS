# ![pageres](images/background_horizontal.png)

## Introduction

RapidCSS is a NPM package and a command line utility that helps users automate declaring selectors in CSS files, based off of the selectors declared in their project... whether that be HTML, JSX, ERB or any other type of file format. This utility works nicely alongside a very fast *code in the browser* workflow.

## Installation

To get the RapidCSS command line utility run:

```
$ npm install rapidcss -g
```

The file paths will be based on the directory from which you run the command.

## Setup

The first step to starting a project with RapidCSS is to setup your project through running

```
$ rapidcss setup
```

This will create a CSS folder structure from the current directory, with mappings of class prefixes to certain files...

### Mappings

Here is a list of how class prefixes will be mapped to your CSS files:

```
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
```

## Compiling

Rapid CSS uses the Node-Walk package to recursive search your file system, starting from an input directory that you provide as the first argument. The second required argument is the output path to your CSS folder.

```
$ rapidcss compile src css
```

With the above command, RapidCSS will look through the src directory for all files that have classes declared and will out declarations of those selectors into your CSS files.

```
// containers.css

.c-main {

}

.c-sub {

}
```

## Options

Several options exist for RapidCSS...

### Allowed Extensions

By default, RapidCSS will search all files, but by using the -e flag and passing RapidCSS a comma separated list:

```
$ rapidcss compile src css -e ".html, .jsx"
```

RapidCSS will only search files with the specified extensions.

### CSS Target Attribute

By default, RapidCSS, looks for the **class=""** pattern in your file tree. If you need to target a different attribute, you could use the -t flag to specify one:

```
$ rapidcss compile src css -t "className"
```