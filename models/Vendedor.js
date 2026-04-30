'use strict';

const { ObjectId } = require('mongodb');
const logger = require('../utils/logger');

class Vendedor {
  constructor(db) {
    this.colecao = db.collection('vendedores');
  }

  async inserir(dados) {
    try {
      if (!dados || !dados.nome) {
        throw new Error('Campo obrigatório ausente: nome');
      }
      if (!dados.email) {
        throw new Error('Campo obrigatório ausente: email');
      }
      const resultado = await this.colecao.insertOne(dados);
      return resultado;
    } catch (erro) {
      logger.registrar('Vendedor', 'inserir', erro);
      throw erro;
    }
  }

  async buscar(filtro = {}) {
    try {
      return await this.colecao.find(filtro).toArray();
    } catch (erro) {
      logger.registrar('Vendedor', 'buscar', erro);
      throw erro;
    }
  }

  async deletar(id) {
    try {
      const resultado = await this.colecao.deleteOne({ _id: new ObjectId(id) });
      return resultado;
    } catch (erro) {
      logger.registrar('Vendedor', 'deletar', erro);
      throw erro;
    }
  }
}

module.exports = Vendedor;
