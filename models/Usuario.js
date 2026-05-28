'use strict';

const crypto = require('crypto');
const logger = require('../utils/logger');

function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex');
}

class Usuario {
  constructor(db) {
    this.colecao = db.collection('usuarios');
  }

  async inserir(dados) {
    try {
      if (!dados || !dados.nome) throw new Error('Campo obrigatório ausente: nome');
      if (!dados.email) throw new Error('Campo obrigatório ausente: email');
      if (!dados.senha) throw new Error('Campo obrigatório ausente: senha');

      const existente = await this.colecao.findOne({ email: dados.email });
      if (existente) throw new Error('E-mail já cadastrado');

      const doc = { nome: dados.nome, email: dados.email, senha: hashSenha(dados.senha) };
      return await this.colecao.insertOne(doc);
    } catch (erro) {
      logger.registrar('Usuario', 'inserir', erro);
      throw erro;
    }
  }

  async autenticar(email, senha) {
    try {
      if (!email) throw new Error('Campo obrigatório ausente: email');
      if (!senha) throw new Error('Campo obrigatório ausente: senha');

      const usuario = await this.colecao.findOne({ email, senha: hashSenha(senha) });
      if (!usuario) throw new Error('E-mail ou senha inválidos');
      return usuario;
    } catch (erro) {
      logger.registrar('Usuario', 'autenticar', erro);
      throw erro;
    }
  }
}

module.exports = Usuario;
