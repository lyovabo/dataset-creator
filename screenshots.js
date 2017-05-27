var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');
var system = require('system');
var files = require('./configs/files.json');
var files2 = require('./configs/files.json');
var configs = require('./configs/config.json');
var system = require('system');
page.onConsoleMessage = function(msg) {
  console.log(msg);
}

function handle_page(file){

    
    page.open('./output/html-default-compiled/'+file,function(){
        
       var h =  page.evaluate(function() {
            var style = document.createElement('style'),
                text = document.createTextNode('body { background: #fff }');
            style.setAttribute('type', 'text/css');
            style.appendChild(text);
            document.head.insertBefore(style, document.head.firstChild);
            return document.getElementsByTagName('body')[0].getBoundingClientRect();
          });
        
        page.viewportSize = { width: 1200, height: 120 /*h.height*/ };
        page.render('./output/jpeg/'+file+'.jpg');
        setTimeout(function(){handle_selected(file)},100);
    });
}
function handle_selected(file){

    
    page.open('./output/html-selected-compiled/'+file,function(){
        
       var h =  page.evaluate(function() {
            var style = document.createElement('style'),
                text = document.createTextNode('body { background: #fff }');
            style.setAttribute('type', 'text/css');
            style.appendChild(text);
            document.head.insertBefore(style, document.head.firstChild);
            return document.getElementsByTagName('body')[0].getBoundingClientRect();
          });
        
        page.viewportSize = { width: 1200, height: 120 /*h.height*/ };
        page.render('./output/selected-jpeg/'+file+'.png', {format: 'png', quality: '100'});
        setTimeout(next_selected,100);
    });
}
function next_selected(){
    var file=files2.shift();
    if(!file){phantom.exit(0);}
    handle_page(file);
}
next_selected();
