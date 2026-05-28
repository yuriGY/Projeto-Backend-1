'use strict';

const express = require('express');
const Produto = require('../models/Produto');
const Categoria = require('../models/Categoria');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();
router.use(autenticar);

router.get('/', async (req, res) => {
  try {
    const filtro = req.query.nome ? { nome: new RegExp(req.query.nome, 'i') } : {};
    const db = req.app.locals.db;
    const prodModel = new Produto(db);
    const catModel = new Categoria(db);

    const produtos = await prodModel.buscar(filtro);
    const categorias = await catModel.buscar();
    const catMap = {};
    categorias.forEach((c) => { catMap[c._id.toString()] = c.nome; });

    const data = produtos.map((p) => ({
      ...p,
      categoria_nome: catMap[p.categoria_id ? p.categoria_id.toString() : ''] || null
    }));

    res.json({ data });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const model = new Produto(req.app.locals.db);
    const resultado = await model.inserir(req.body);
    res.status(201).json({ mensagem: 'Produto inserido', id: resultado.insertedId });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const model = new Produto(req.app.locals.db);
    const resultado = await model.deletar(req.params.id);
    if (!resultado.deletedCount) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json({ mensagem: 'Produto deletado' });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

module.exports = router;
