var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = () => {
    var app = express();

    //adiciona as funções de urlencoded e json ao app
    app.use(bodyParser.urlencoded({extended : true}));
    app.use(bodyParser.json());
    //adiciona a função de validação ao app
    app.use(expressValidator());

    consign()
        .include('./routes')
        .then('persistence')
        .then('services')
        .into(app);

    return app;
}