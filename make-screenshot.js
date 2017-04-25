const webshot = require('webshot'),
      compiledCssFolder = './output/compiled-css-list/',
      jsdom = require("jsdom"),
      fs = require('fs');
var html = fs.readdirSync('./html'),
    htmlFilesList = [],
    cssFilesList = [];
html.forEach(file => {
  if(file!='.DS_Store') {
    htmlFilesList.push(file);
  }
});
var css = fs.readdirSync('./output/compiled-css-list');
css.forEach(file => {
  if(file != '.DS_Store') {
    cssFilesList.push(file);
  }
});

var selectedConf = fs.readFileSync('./selected-css-config/selected.css', 'utf8')

htmlFilesList.forEach(function(htmlFile) {
  cssFilesList.forEach(function(cssFile) {  
    var styles = fs.readFileSync(compiledCssFolder + cssFile, 'utf8')
    var options = {
      siteType: 'file',
      customCSS: styles,
      width: 'window',
      height: 'window',
      defaultWhiteBackground: true
    }
    try{
    webshot("./html/" + htmlFile, './output/jpeg/' + cssFile + htmlFile + '.jpg', options, function(err) {
      console.log('first webshot')
      console.log(err);
    });

    var styles2 = fs.readFileSync(compiledCssFolder + cssFile, 'utf8')
    var selectedCss = styles2 + selectedConf;
    options = {
      siteType: 'file',
      customCSS: selectedCss,
      width: 'window',
      height: 'window',
      defaultWhiteBackground: true
    }
    webshot('./output/html-selected/'+htmlFile+'-selected.html', './output/selected-jpeg/'+cssFile+htmlFile+'-selected.jpg', options, function(err) {
       console.log('second webshot')
      console.log(err);
    });
  }catch(err) {
    console.log('error is ok , screenshot making is going on');
    console.log(err);
    console.log('error is ok , screenshot making is going on');
  }
      
    
  })
});

