'use strict';

const { ObjectId } = require('mongodb');
const logger = require('../utils/logger');

class Produto {
  constructor(db) {
    this.colecao = db.collection('produtos');
  }

  async inserir(dados) {
    try {
      if (!dados || !dados.nome) {
        throw new Error('Campo obrigatório ausente: nome');
      }
      if (dados.preco === undefined || dados.preco === null) {
        throw new Error('Campo obrigatório ausente: preco');
      }
      if (dados.estoque === undefined || dados.estoque === null) {
        throw new Error('Campo obrigatório ausente: estoque');
      }
      if (!dados.categoria_id) {
        throw new Error('Campo obrigatório ausente: categoria_id');
      }
      if (!dados.vendedor_id) {
        throw new Error('Campo obrigatório ausente: vendedor_id');
      }
      const resultado = await this.colecao.insertOne(dados);
      return resultado;
    } catch (erro) {
      logger.registrar('Produto', 'inserir', erro);
      throw erro;
    }
  }

  async buscar(filtro = {}) {
    try {
      return await this.colecao.find(filtro).toArray();
    } catch (erro) {
      logger.registrar('Produto', 'buscar', erro);
      throw erro;
    }
  }

  async deletar(id) {
    try {
      const resultado = await this.colecao.deleteOne({ _id: new ObjectId(id) });
      return resultado;
    } catch (erro) {
      logger.registrar('Produto', 'deletar', erro);
      throw erro;
    }
  }
}

module.exports = Produto;
