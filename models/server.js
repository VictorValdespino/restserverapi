const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');



class Server {


    constructor() {
        //propiedades
        this.app = express();
        this.port = process.env.PORT
        this.usuariosPath ='/api/usuarios'

        //conectar a base de datos
        this.conectarDB();
        //middleware, funciones que van a añadir otra funcion a nuestro webserverr

        this.middleware();

        //rutas
        this.routes();
    }

    async conectarDB() {

        await dbConnection();

    }

    middleware() {
        this.app.use(cors());
        //parseo y lectura de body

        this.app.use( express.json());  

        //directorio publico
        this.app.use( express.static('public') );
    }

    //rutas
    routes() {

        this.app.use('/api/usuarios',require('../routes/usuarios'))

    }

    //puerto de escucha
    listen() {
        

        this.app.listen( this.port,  () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server