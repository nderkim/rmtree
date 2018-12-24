const fs = require('fs');
const path = require('path');
const promisify = require('@nderkim/promisify')

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

module.exports = fn = dirPath => readdir(dirPath)
  .then(files => Promise.all(files.map(file => {
    const filePath = path.join(dirPath, file);
    return stat(filePath)
      .then(stats => stats.isDirectory() ? fn(filePath) : unlink(filePath));
  })))
  .then(() => rmdir(dirPath));
