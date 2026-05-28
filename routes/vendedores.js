'use strict';

const express = require('express');
const Vendedor = require('../models/Vendedor');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();
router.use(autenticar);

router.get('/', async (req, res) => {
  try {
    const filtro = req.query.nome ? { nome: new RegExp(req.query.nome, 'i') } : {};
    const model = new Vendedor(req.app.locals.db);
    const data = await model.buscar(filtro);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const model = new Vendedor(req.app.locals.db);
    const resultado = await model.inserir(req.body);
    res.status(201).json({ mensagem: 'Vendedor inserido', id: resultado.insertedId });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const model = new Vendedor(req.app.locals.db);
    const resultado = await model.deletar(req.params.id);
    if (!resultado.deletedCount) return res.status(404).json({ erro: 'Vendedor não encontrado' });
    res.json({ mensagem: 'Vendedor deletado' });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

module.exports = router;
