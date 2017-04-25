var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');
var builder = require('xmlbuilder');
var system = require('system');
var files = require('./configs/files.json');
var configs = require('./configs/config.json');

page.onConsoleMessage = function(msg) {
  console.log(msg);
}

function makepage(x) {
  var y = require("webpage").create();
  return function() {
    y.open('./output/html-compiled/' + x, function(status) {


      var text = y.evaluate(function(configs) {
        var s = [];
        for (var c = 0; c < configs.length; c++) {
          var z = document.querySelectorAll('.' + configs[c].element);
          for (var i = 0; i < z.length; i++) {
            s.push({ name: configs[c].element, position: z[i].getBoundingClientRect() });
          }
        }
        return s;
      }, configs, x);
      // console.log(JSON.stringify(text), x);
      if (!!text.length) {

        var xml = builder.create('annotation');

        xml.ele('folder', 'xml');
        xml.ele('filename', x);
        xml.ele('size').ele('width', 1024).up().ele('height', 768).up().ele('depth', 1);
        for (var i = 0; i < text.length; i++) {
          xml.ele('object').ele('name', text[i].name).up()
            .ele('bnbox').ele('xmin',text[i].position.left)
            .up().ele('ymin', text[i].position.top)
            .up().ele('xmax', text[i].position.right)
            .up().ele('ymax', text[i].position.bottom);
        }
        var content = xml.toString();
        fs.write('./output/xml/' + x + '.xml', content, 'w');
      }
    });
  };
}
files.forEach(function(config) {

  makepage(config)();
})
