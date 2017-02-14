let fs = require('fs');
let arquivo = process.argv[2];

fs.createReadStream(arquivo)
    .pipe(fs.createWriteStream("arquivoCopiado.jpg"))
    .on('finish', err => {
        console.log('Terminou de copiar o arquivo');
    });