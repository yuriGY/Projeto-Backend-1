'use strict';

const { ObjectId } = require('mongodb');
const logger = require('../utils/logger');

class Categoria {
  constructor(db) {
    this.colecao = db.collection('categorias');
  }

  async inserir(dados) {
    try {
      if (!dados || !dados.nome) {
        throw new Error('Campo obrigatório ausente: nome');
      }
      const resultado = await this.colecao.insertOne(dados);
      return resultado;
    } catch (erro) {
      logger.registrar('Categoria', 'inserir', erro);
      throw erro;
    }
  }

  async buscar(filtro = {}) {
    try {
      return await this.colecao.find(filtro).toArray();
    } catch (erro) {
      logger.registrar('Categoria', 'buscar', erro);
      throw erro;
    }
  }

  async deletar(id) {
    try {
      const resultado = await this.colecao.deleteOne({ _id: new ObjectId(id) });
      return resultado;
    } catch (erro) {
      logger.registrar('Categoria', 'deletar', erro);
      throw erro;
    }
  }
}

module.exports = Categoria;
