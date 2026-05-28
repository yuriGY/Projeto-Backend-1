'use strict';

const express = require('express');
const Usuario = require('../models/Usuario');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();

router.post('/registrar', async (req, res) => {
  try {
    const model = new Usuario(req.app.locals.db);
    const resultado = await model.inserir(req.body);
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso', id: resultado.insertedId });
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const model = new Usuario(req.app.locals.db);
    const usuario = await model.autenticar(email, senha);
    req.session.usuario = { _id: usuario._id.toString(), nome: usuario.nome, email: usuario.email };
    res.json({ mensagem: 'Login realizado com sucesso', usuario: req.session.usuario });
  } catch (e) {
    res.status(401).json({ erro: e.message });
  }
});

router.post('/logout', autenticar, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao encerrar sessão' });
    res.json({ mensagem: 'Logout realizado com sucesso' });
  });
});

router.get('/me', autenticar, (req, res) => {
  res.json({ usuario: req.session.usuario });
});

module.exports = router;
