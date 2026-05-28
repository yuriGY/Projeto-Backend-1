'use strict';

function autenticar(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ erro: 'Não autenticado. Faça login em POST /auth/login.' });
  }
  next();
}

module.exports = autenticar;
