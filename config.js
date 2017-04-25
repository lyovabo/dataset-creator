const fs = require('fs'),
scssToJson = require('scss-to-json');
var outputPath  = './output';
var folders = ['compiled-css-list','html-compiled','html-selected','jpeg','selected-jpeg','xml'];
fs.mkdirSync('./output');
folders.forEach(function(folder) {
  fs.mkdirSync(outputPath+'/'+folder);
})

var variables = scssToJson('./bootstrap/bootstrap/_variables.scss');
var str = JsonToSass(variables);
fs.writeFileSync('./configs/variables.json', JSON.stringify(variables),function(){});


function JsonToSass(sassObj) {
  var parsedVariables = '';
  for (var key in sassObj) {
    parsedVariables += key + ':' + sassObj[key] + ';' + '\n';
  }
  return parsedVariables;
}