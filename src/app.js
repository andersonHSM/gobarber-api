import express from 'express';
import routes from './routes';

// Importação da classe de inicialização do DB já instanciada.
import './database';

// Criação de uma classe para desacoplamento de código
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

// Exportação somente do server
// diretamente a partir da instância da classe

export default new App().server;
