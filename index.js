const webshot = require('webshot'),

  fs = require('fs'),
  jsdom = require("jsdom"),
  sass = require('node-sass'),
  configs = require('./configs/config.json'),
  selectedCssPath = './configs/selected.css',
  scssToJson = require('scss-to-json'),
  rgbHex = require('rgb-hex'),
  htmlTemplateFolder = './html/',
  compiledCssFolder = './compiled-css-list/',
  scssVariables = './bootstrap/bootstrap/_variables.scss',
  variablesJson = require('./configs/_variables.json'),
  
  system = require('system'),
  phantom = require('node-phantom');

var htmlFilesList = [],
    cssFilesList = [];

var files = fs.readdirSync(htmlTemplateFolder);
files.forEach(file => {
  htmlFilesList.push(file);
});
htmlFilesList.forEach(function(file) {
  jsdom.env({
    file: './html/' + file,
    done: function(err, window) {
      addSelectedClasses(window.document,configs);
      fs.writeFile('./html-selected/' + file + '-selected.html', window.document.documentElement.outerHTML,
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
var selectedConf = fs.readFileSync('./selected-css-config/selected.css', 'utf8')
//selected elements screenshoting
htmlFilesList.forEach(function(htmlFile) {
  cssFilesList.forEach(function(cssFile) {
    var styles = fs.readFileSync(compiledCssFolder + cssFile, 'utf8')
    var options = {
      siteType: 'file',
      customCSS: styles
    }
    webshot("./html/" + htmlFile, './jpeg/' + htmlFile + cssFile + '.jpg', options, function(err) {
      // console.log(err);
    });

    
    var selectedCss = styles + selectedConf;
    options = {
      siteType: 'file',
      customCSS: selectedCss
    }
    webshot('./html-selected/'+htmlFile+'-selected.html', './selected-jpeg/'+htmlFile+cssFile+'-selected.jpg', options, function(err) {
      // console.log(err);
    });
      
    jsdom.env({
      file: "./html/"+htmlFile,
      done:function(err, window) {
        setStyles(window.document, cssFile);
        fs.writeFileSync('./temp/'+cssFile+htmlFile, window.document.documentElement.outerHTML,function(){

        })
      }
    })
  })
});


function compileAndWriteCss(sassString, fileName) {
  fs.writeFileSync('./bootstrap/bootstrap/_variables.scss', sassString);
  var result = sass.renderSync({
    file: './bootstrap/bootstrap.scss'
  });
  fs.writeFileSync(compiledCssFolder + '/bootstrap-' + fileName + '.css', result.css);
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




function setStyles(document,cssFile){
  var head  = document.getElementsByTagName('head')[0];
  var link  = document.createElement('link');
  link.href = "../compiled-css-list/"+cssFile;
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
