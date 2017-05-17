var webpack = require('webpack'),
    webpackCfg = require('./webpack.myApp.config.js'),
    compiler = webpack(webpackCfg),
    express = require('express'),
    app = express(),
    path = require('path');
    
var Lint = require('tslint');

console.log(Lint);

var watchOptions = {
    aggregateTimeout:300,
    poll:true
};

var watchHandler =  function(err,stats) {
    if(err) {
        console.log(err);
    }
    console.log(stats.toString({chunks:false,colors:true}));
};

compiler.watch(watchOptions,watchHandler);

app.set('port',process.env.PORT || 3000);

app.use(express.static(path.join(__dirname,'app/myApp/')));

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});