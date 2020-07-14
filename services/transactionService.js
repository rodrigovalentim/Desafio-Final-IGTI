const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

class transactionService {
  async index(req, res) {
    const { period } = req.query;
    if (!period) {
      return res.status(400).json({error: "É necessário informar o parametro pediod, cujo valor deve ser no formato yyyy-mm"});
    }
    const trans = await TransactionModel.find({yearMonth: period});
    return res.send(trans);
  }

  async show(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({error: "Necessário informar o ID para filtrar"});
    }
    const trans = await TransactionModel.findById(id);
    return res.send(trans);
  }

  async store(req, res) {
    const { description, value, category, yearMonthDay, type } = req.body.data;
    console.log(yearMonthDay);
    const [year, month, day] = yearMonthDay.split('-');
    console.log(year);
    console.log(month);
    console.log(day);
    const transaction = new TransactionModel({
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: `${year}-${month}`,
      yearMonthDay,
      type
    });
    //
    const trans = await transaction.save();
    return res.send(trans);
    //
  }

  async destroy(req, res) {
    //
    const { id } = req.params;
    //
    try {
     
    await TransactionModel.findOneAndDelete({_id: id });
    return res.send(`Registro removido com sucesso: ${id}`);

    } catch (err) {
    return res.status(500).json({error: `Erro ao excluir registro: id:${id} [ERROR]${err}` });
      
    }
    //
  }

  async update(req, res) {
    const { id } = req.params;
    const { description, value, category, yearMonthDay, type } = req.body.data;
    const [year, month, day] = yearMonthDay.split('-');
    const transaction = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: `${year}-${month}`,
      yearMonthDay,
      type
    };
    //
    try {
      const trans = await TransactionModel.findOneAndUpdate({_id: id }, transaction, { new: true });
      return res.send(trans);
    } catch (err) {
      return res.status(500).json({error: `Erro ao excluir registro: id:${id} [ERROR]${err}` }); 
    }
  }
  
}
module.exports = new transactionService();
