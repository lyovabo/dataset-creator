const fs = require('fs'),
scssToJson = require('scss-to-json');
 
var variables = scssToJson('./bootstrap/bootstrap/_variables.scss');
console.log(variables)
var str = JsonToSass(variables);
fs.writeFileSync('./configs/variables_test.json', JSON.stringify(variables),function(){});
