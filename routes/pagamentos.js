module.exports = function(app) {
    const PAGAMENTO_CRIADO = "CRIADO";
    const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
    const PAGAMENTO_CANCELADO = "CANCELADO";


   app.get("/pagamentos",function(req, res) {
        res.send('ok');
    });

    app.delete("/pagamentos/pagamento/:id", (req, res) => {
        let pagamento = {};
        let id = req.params.id;

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CANCELADO;

        let connection = app.persistence.connectionFactory();
        let pagamentoDao = new app.persistence.PagamentoDao(connection);

        pagamentoDao.update(pagamento, (exception, result) => {
            if(exception){
                console.log('erro interno do servidor: ' + exception);
                res.status(500).json(exception);
                return;
            } else {
                console.log('pagamento cancelado');
                res.send(pagamento);
                return;
            }
        });
        
    });

    app.put("/pagamentos/pagamento/:id", (req, res) => {
        let pagamento = {};
        let id = req.params.id;

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CONFIRMADO;

        let connection = app.persistence.connectionFactory();
        let pagamentoDao = new app.persistence.PagamentoDao(connection);

        let response = {
                pagamento : pagamento,
                links : [
                    {
                        href : "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                        method : "DELETE",
                        rel : "CANCELAR"
                    }
                ]
            }

        pagamentoDao.update(pagamento, (exception, result) => {
            if(exception){
                console.log('erro interno do servidor: ' + exception);
                res.status(500).json(exception);
                return;
            } else {
                console.log('pagamento confirmado');
                res.send(response);
                return;
            }
        });
    });

    app.post("/pagamentos/pagamento", (req, res) => {        
        let jsonInput = req.body;
        let pagamento = jsonInput['pagamento'];
        //adicionando validações ao request
        //req.assert("nome_do_campo_JSON", "mensagem de erro.").validationMethod();
        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("pagamento.valor", "Valor deve ser um decimal.").isFloat();
        req.assert("pagamento.moeda", "Moeda deve conter 3 caracteres.").len(3,3);
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

            pagamento.status = PAGAMENTO_CRIADO;
            pagamento.data = new Date();

            pagamentoDao.insert(pagamento, (exception, result) => {
                //result => Resultado do insert realizado pelo mysql
                //exception => caso ocorra um erro durante o insert, a variável virá com valor
                if(exception){
                    console.log('erro interno do servidor: ' + exception);
                    res.status(500).json(exception);
                    return;    
                } else {
                    pagamento.id = result.insertId;
                    if(pagamento.forma_de_pagamento == 'cartao'){
                        var cartao = req.body["cartao"];
                        console.log(cartao);

                        var clienteCartoes = new app.services.cartoesClient();

                        clienteCartoes.autoriza(cartao, function(exception, request, response, retorno){
                            if(exception){
                                console.log(exception);
                                res.status(400).send(exception);
                                return;
                            }
                            console.log(retorno);

                            res.location('/pagamentos/pagamento/' + pagamento.id);

                            var response = {
                                pagamento: pagamento,
                                cartao: retorno,
                                links: [
                                {
                                    href:"http://localhost:3000/pagamentos/pagamento/"
                                            + pagamento.id,
                                    rel:"confirmar",
                                    method:"PUT"
                                },
                                {
                                    href:"http://localhost:3000/pagamentos/pagamento/"
                                            + pagamento.id,
                                    rel:"cancelar",
                                    method:"DELETE"
                                }
                                ]
                            }
                            res.status(201).json(response);
                            return;
                        });
                    } else {
                        let response = {
                            pagamento : pagamento,
                            links : [
                                {
                                    href : "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                    method : "PUT",
                                    rel : "CONFIRMAR"
                                },
                                {
                                    href : "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                    method : "DELETE",
                                    rel : "CANCELAR"
                                }
                            ]
                        }
                        console.log('pagamento criado: ' + result);
                        res.location('/pagamentos/pagamento/' + result.insertId);
                        res.status(201).json(response);
                        return;
                    }    
                }
            });
        }
    });    
}