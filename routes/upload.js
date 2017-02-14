let fs = require('fs');

module.exports = function(app){
    app.post('/upload/imagem', (req, res) => {
        req.pipe(fs.createWriteStream("files/" + req.headers.filename + ".jpg"))
        .on('finish', error => {
            console.log('Terminou de receber o arquivo');
            res.status(201).send('Terminou');
        })
    })
}