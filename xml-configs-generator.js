const fs = require('fs');
var files = fs.readdirSync('./temp');
fs.writeFileSync('./configs/files.json', JSON.stringify(files));