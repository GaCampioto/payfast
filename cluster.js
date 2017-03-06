var cluster = require('cluster');
var os = require('os');


console.log("Inicializando a thread");
if(cluster.isMaster){
    let cpus = os.cpus();
    console.log(os.cpus);
    cpus.forEach(() => {
        cluster.fork();
    });
} else {
    require("./index.js");
    cluster.on('listening', worker =>{
        console.log('Slave rodando -> ' + worker.process.pid);
    });

    cluster.on('exit', worker =>{
        cluster.fork();
    });
}
