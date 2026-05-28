'use strict';

const express = require('express');
const Categoria = require('../models/Categoria');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();
router.use(autenticar);

router.get('/', async (req, res) => {
  try {
    const filtro = req.query.nome ? { nome: new RegExp(req.query.nome, 'i') } : {};
    const model = new Categoria(req.app.locals.db);
    const data = await model.buscar(filtro);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const model = new Categoria(req.app.locals.db);
    const resultado = await model.inserir(req.body);
    res.status(201).json({ mensagem: 'Categoria inserida', id: resultado.insertedId });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const model = new Categoria(req.app.locals.db);
    const resultado = await model.deletar(req.params.id);
    if (!resultado.deletedCount) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json({ mensagem: 'Categoria deletada' });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

module.exports = router;
