let winston = require('winston');
let fs = require('fs');

if(!fs.existsSync('logs')){
    fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
    transports:[
        new winston.transports.File({
            level: "info",
            filename: "logs/payfast.log",
            maxSize: 100000,
            maxFiles: 10,
            colorize: false
        })
    ] 
});