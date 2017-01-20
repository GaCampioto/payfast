function PagamentoDao(connection) {
    this._connection = connection;
}

PagamentoDao.prototype.insert = function(pagamento,callback) {
    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
}

PagamentoDao.prototype.getAll = function(callback) {
    this._connection.query('select * from pagamentos',callback);
}

PagamentoDao.prototype.getById = function (id,callback) {
    this._connection.query("select * from pagamentos where id = ?",[id],callback);
}

module.exports = function(){
    return PagamentoDao;
};