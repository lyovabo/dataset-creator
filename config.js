const fs = require('fs'),
scssToJson = require('scss-to-json'),
jsdom = require("jsdom"),
configs = require('./configs/config.json'),
htmlTemplateFolder = './html/';
var outputPath  = './output',
folders = ['compiled-css-list','selected-css-list','html-default-compiled','html-selected-compiled','html-selected','jpeg','selected-jpeg','xml'],
htmlFilesList = [];
fs.mkdirSync('./output');
try{
  folders.forEach(function(folder) {
    fs.mkdirSync(outputPath+'/'+folder);
  })

  } catch(e){
  // console.log(e);
}
var files = fs.readdirSync(htmlTemplateFolder);
files.forEach(file => {
  if(file!='.DS_Store') {
    htmlFilesList.push(file);
  }
});
var variables = scssToJson('./bootstrap/bootstrap/_variables.scss');
var str = JsonToSass(variables);
fs.writeFileSync('./configs/_variables.json', JSON.stringify(variables),function(){});


function JsonToSass(sassObj) {
  var parsedVariables = '';
  for (var key in sassObj) {
    parsedVariables += key + ':' + sassObj[key] + ';' + '\n';
  }
  return parsedVariables;
}
function addSelectedClasses(document,confs) {
  for (var j = 0; j < confs.length; j++) {
    var element = document.querySelectorAll('.' + confs[j].element);
    for (var i = 0; i < element.length; i++) {
      element[i].classList.add(confs[j].className);
    }
  }
}

htmlFilesList.forEach(function(file) {
    jsdom.env({
      file: './html/' + file,
      done: function(err, window) {
        addSelectedClasses(window.document,configs);
        fs.writeFileSync('./output/html-selected/' + file, window.document.documentElement.outerHTML,
          function(error) {
            if (error) throw error;
          });
      }
    });
  })