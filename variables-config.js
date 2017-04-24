// const fs = require('fs'),
// scssToJson = require('scss-to-json');
 
// var variables = scssToJson('./bootstrap/bootstrap/_variables.scss');
// console.log(variables)
// var str = JsonToSass(variables);
// fs.writeFileSync('./configs/variables_test.json', JSON.stringify(variables),function(){});
var builder = require('xmlbuilder');
var xml = builder.create('annotation');
              xml.ele('folder','xml');
              xml.ele('filename','zzz');
              xml.ele('size').ele('width',1024).up().ele('height',768);
              

              // xml.ele('size').ele('height',768);
              // xml.ele('size').ele('depth',1);
              console.log(xml.toString());