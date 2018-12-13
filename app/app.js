var express = require('express');
var path = require("path");
var app = express();
var fortune = require("./lib/fortune");


app.set('port', process.env.PORT || 3000);


app.get('/', function(req, res) {  
    res.render('/layouts/main',{body:'hello'}); 
}); 

var obj = { 
    currency: { 
            name: 'United States dollars', 
            abbrev: 'USD', 
    }, 
    tours : [ 
            { name: 'Hood River', price: '$99.95' } ,  
            { name: 'Oregon Coast', price: '$159.95' }
    ] , 
    specialsUrl: '/january-specials', 
    currencies: [ 'USD', 'GBP', 'BTC' ], 
}

app.get('/about', function(req, res){ 
    res.render('about', obj); 
});

// 404 catch-all 处理器（中间件）
app.use(function(req, res, next){  
   res.status(404); 
   res.render('404'); 
}); 

// 500 错误处理器（中间件）
app.use(function(err, req, res, next){  
   console.error(err.stack); 
   res.status(500); 
   res.render('500'); 
});


// 设置 handlebars 视图引擎 
var handlebars = require('express3-handlebars') .create({ defaultLayout:'main' }); 
app.engine('handlebars', handlebars.engine); 
app.set("views", path.join(__dirname, "/views"));
app.set('view engine', 'handlebars');

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});