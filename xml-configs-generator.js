const fs = require('fs');
var files = fs.readdirSync('./output/html-compiled');
var htmlFilesList = [];
files.forEach(file => {
  if(file != '.DS_Store') {
    htmlFilesList.push(file);
  }
});
fs.writeFileSync('./configs/files.json', JSON.stringify(htmlFilesList));