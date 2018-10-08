/* eslint-disable no-console */

// This script is used to copy the static documentation reports into a centralised documentation folder
const fs = require('fs-extra');
const path = require('path');

const outputDirFolderName = 'documentation';

const compodocFolder = 'compodoc';
const testReportsFolder = 'test-reports';
const typedocFolder = 'typedoc';
const compodocFullPath = path.resolve(__dirname, '../' + compodocFolder);
const compodocOutputFullPath = path.resolve(__dirname, '../' + outputDirFolderName + '/' + compodocFolder);
const testReportsFullPath = path.resolve(__dirname, '../' + testReportsFolder);
const testReportsOutputFullPath = path.resolve(__dirname, '../' + outputDirFolderName + '/' + testReportsFolder);
const typedocFullPath = path.resolve(__dirname, '../' + typedocFolder);
const typedocOutputFullPath = path.resolve(__dirname, '../' + outputDirFolderName + '/' + typedocFolder);

console.log('Copying ' + compodocFolder + ' folder to ' + outputDirFolderName + '...');
fs.copySync(compodocFullPath, compodocOutputFullPath);

console.log('Copying ' + testReportsFolder + ' folder to ' + outputDirFolderName + '...');
fs.copySync(testReportsFullPath, testReportsOutputFullPath);

console.log('Copying ' + typedocFolder + ' folder to ' + outputDirFolderName + '...');
fs.copySync(typedocFullPath, typedocOutputFullPath);
