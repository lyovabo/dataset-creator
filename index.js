const webshot = require('webshot'),

  fs = require('fs'),
  jsdom = require("jsdom"),
  sass = require('node-sass'),
  configs = require('./configs/config.json'),
  selectedCssPath = './selected-css-config/selected.css',
  scssToJson = require('scss-to-json'),
  rgbHex = require('rgb-hex'),
  htmlTemplateFolder = './html/',
  compiledCssFolder = './output/compiled-css-list/',
  selectedCssFolder = './output/selected-css-list',
  scssVariables = './bootstrap/bootstrap/_variables.scss',
  variablesJson = require('./configs/_variables.json'),
  
  system = require('system'),
  phantom = require('node-phantom');

var htmlFilesList = [],
    cssFilesList = [];

var selectedCss = fs.readFileSync(selectedCssPath);
var files = fs.readdirSync(htmlTemplateFolder);
files.forEach(file => {
  if(file!='.DS_Store') {
    htmlFilesList.push(file);
  }
});
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

configs.forEach(function(element) {
  element.fields.forEach(function(field) {
    var def = variablesJson['$' + field['bootstrap-variable']];
    if (field.type == 'number') {
      for (var step = field.min; step <= field.max; step += field.step) {
        setNumberValue(variablesJson, field['bootstrap-variable'], step);
        const sassString = JsonToSass(variablesJson);
        const fileName = field['bootstrap-variable'] + step;
        compileAndWriteCss(sassString, fileName);
        cssFilesList.push('bootstrap-' + fileName + '.css');
      }
    } else if (field.type == 'color') {
      var colors = {
        'red': 0,
        'green': 0,
        'blue': 0
      };
      for (var step = 0; step <= 255; step += 25) {
        for (var color in colors) {
          colors[color] = step;
          setColorValue(variablesJson, field['bootstrap-variable'], colors);
          const sassString = JsonToSass(variablesJson);
          const fileName = field['bootstrap-variable'] + color + step;
          compileAndWriteCss(sassString, fileName);
          cssFilesList.push('bootstrap-' + fileName + '.css');
        };
      }
    }
    variablesJson['$' + field['bootstrap-variable']] = def;
  });
});
var compiledFilesList = [];
htmlFilesList.forEach(function(htmlFile,hindex) {
  cssFilesList.forEach(function(cssFile,cindex){
  compiledFilesList.push(cssFile + htmlFile + '.html');
  jsdom.env({
    file: './html/' + htmlFile,
    done: function(err, window) {
      setStyles(window.document, cssFile,"../compiled-css-list/");
      fs.writeFileSync('./output/html-default-compiled/' + cssFile + htmlFile + '.html', window.document.documentElement.outerHTML,
        function(error) {
          if (error) throw error;
        });

      }
    });
  jsdom.env({
    file: './output/html-selected/' + htmlFile,
    done: function(err, window) {
      // console.log(window.document.documentElement.outerHTML);
      
      setStyles(window.document, cssFile, "../selected-css-list/");
      fs.writeFileSync('./output/html-selected-compiled/' + cssFile + htmlFile + '.html', window.document.documentElement.outerHTML,
        function(error) {
          if (error) throw error;
        });
        
      }
    });

  })
});
fs.writeFileSync('./configs/files.json', JSON.stringify(compiledFilesList));
// console.log(compiledFilesList);


function compileAndWriteCss(sassString, fileName) {
  fs.writeFileSync('./bootstrap/bootstrap/_variables.scss', sassString);
  var result = sass.renderSync({
    file: './bootstrap/bootstrap.scss'
  });
  fs.writeFileSync(compiledCssFolder + '/bootstrap-' + fileName + '.css', result.css);
  writeSelectedCss(result.css,fileName);
}
function writeSelectedCss(styles,fileName) {
  
  styles = styles + selectedCss;
  fs.writeFileSync(selectedCssFolder + '/bootstrap-' + fileName + '.css', styles);
}

function JsonToSass(sassObj) {
  var parsedVariables = '';
  for (var key in sassObj) {
    parsedVariables += key + ':' + sassObj[key] + ';' + '\n';
  }
  return parsedVariables;
}

function setNumberValue(variables, fieldName, value) {
  variables['$' + fieldName] = value + 'px';
}

function setColorValue(variables, fieldName, colors) {
  variables['$' + fieldName] = '#' + rgbHex(colors['red'], colors['green'], colors['blue']);
}




function setStyles(document,cssFile,path){
  var head  = document.getElementsByTagName('head')[0];
  var link  = document.createElement('link');
  link.href = path+cssFile;
  link.rel  = 'stylesheet';
  link.type = 'text/css';  
  link.media = 'all';
  head.appendChild(link);
}
function addSelectedClasses(document,confs) {
  for (var j = 0; j < confs.length; j++) {
    var element = document.querySelectorAll('.' + confs[j].element);
    for (var i = 0; i < element.length; i++) {
      element[i].classList.add(confs[j].className);
    }
  }
}
