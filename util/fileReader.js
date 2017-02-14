let fs = require('fs');
let arquivo = process.argv[2];

fs.readFile(arquivo, function(error, buffer){
    console.log('Arquivo lido');
    fs.writeFile('Arquivo_copiado.jpg', buffer, function(error){
        console.log('Arquivo copiado');
    });
});
