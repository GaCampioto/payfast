module.exports = function(app) {
   app.get("/pagamentos",function(req, res) {
        res.send('ok');
    });

    app.post("/pagamentos/pagamento", (req, res) => {        
        let jsonInput = req.body;
        //adicionando validações ao request
        //req.assert("nome_do_campo_JSON", "mensagem de erro.").validationMethod();
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("valor", "Valor deve ser um decimal.").isFloat();
        req.assert("moeda", "Moeda deve conter 3 caracteres.").len(3,3);
        //validando se as validações acima retornam true
        //em caso positivo a variável error vai ter valor
        let error = req.validationErrors();
        //Caso ela tenha valor, devolver status 400 com a mensagem de erro
        if(error){
            res.status(400).send(error);
            return;
        } else {
            //Recuperando conexão com o Banco
            let connection = app.persistence.connectionFactory();
            //Instanciando pagamentoDao
            let pagamentoDao = new app.persistence.PagamentoDao(connection);

            jsonInput.status = 'CRIADO';
            jsonInput.data = new Date();

            pagamentoDao.insert(jsonInput, (exception, result) => {
                //result => Resultado do insert realizado pelo mysql
                //exception => caso ocorra um erro durante o insert, a variável virá com valor
                if(exception){
                    console.log('erro interno do servidor: ' + exception);
                    res.status(500).json(exception);
                    return;    
                } else {
                    console.log('pagamento criado: ' + result);
                    res.location('/pagamentos/pagamento/' + result.insertId);
                    res.status(201).json(jsonInput);
                    return;    
                }
            });
        }
    });

    
}