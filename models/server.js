const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');



class Server {


    constructor() {
        //propiedades
        this.app = express();
        this.port = process.env.PORT;
        this.paths= {

            

            authPath : '/api/auth',

            buscarPath: '/api/buscar',

            categoriasPath: '/api/categorias',

            productosPath : '/api/productos',

            usuariosPath : '/api/usuarios',

            uploadsPath: '/api/uploads'

            
        }
        
        


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

        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }));
    }

    //rutas
    routes() {

        this.app.use(this.paths.authPath,require('../routes/auth'));

        this.app.use(this.paths.buscarPath,require('../routes/buscar'));
        
        this.app.use(this.paths.categoriasPath,require('../routes/categorias'));

        this.app.use(this.paths.usuariosPath,require('../routes/usuarios'));

        this.app.use(this.paths.productosPath,require('../routes/productos'));

        this.app.use(this.paths.uploadsPath,require('../routes/uploads'));

    }

    //puerto de escucha
    listen() {
        

        this.app.listen( this.port,  () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server