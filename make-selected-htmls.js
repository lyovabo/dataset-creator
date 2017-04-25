const jsdom = require("jsdom"),
  fs = require('fs');
var html = fs.readdirSync('./html');
var css = fs.readdirSync('./output/compiled-css-list');
var htmlFilesList = [];
var cssFilesList = [];
html.forEach(file => {
  if(file!='.DS_Store') {
    htmlFilesList.push(file);
  }
});

css.forEach(file => {
  if(file != '.DS_Store') {
    cssFilesList.push(file);
  }
});

htmlFilesList.forEach(function(htmlFile) {
  cssFilesList.forEach(function(cssFile) {
    jsdom.env({
      file: "./html/"+htmlFile,
      done:function(err, window) {
        setStyles(window.document, cssFile);
        fs.writeFileSync('./output/html-compiled/'+cssFile+htmlFile, window.document.documentElement.outerHTML,function(){

        })
      }
    })
  })
})

function setStyles(document,cssFile){
  var head  = document.getElementsByTagName('head')[0];
  var link  = document.createElement('link');
  link.href = "../compiled-css-list/"+cssFile;
  link.rel  = 'stylesheet';
  link.type = 'text/css';  
  link.media = 'all';
  head.appendChild(link);
}