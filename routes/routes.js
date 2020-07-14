const express = require('express');
const transactionService = require('../services/transactionService');
const dataService = require('../services/dataService');
const transactionRouter = express.Router();

transactionRouter.get('/', transactionService.index);
transactionRouter.get('/find/:id/', transactionService.show);
transactionRouter.post('/save', transactionService.store);
transactionRouter.delete('/remove/:id', transactionService.destroy);
transactionRouter.patch('/update/:id', transactionService.update);
transactionRouter.get('/months', dataService.index);

module.exports = transactionRouter;
