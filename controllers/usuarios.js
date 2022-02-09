const { response,request } = require('express');
const Usuario = require('../models/usuarios')
const bccrypyjs = require('bcryptjs');
const bcryptjs = require('bcryptjs');


/*

    obtener usuarios

*/

const  usuariosGet = async (req, res) => {

    const query = {estado:true};

    //recibir datos
    //const {q,page,limit} = req.query
    const {limite = 5, desde = 0} = req.query;
    //En find puedo filtrar los usuarios


    //arreglo cobntodas las promesas que se ejecuten
    //Promise.all  las ejecuta al mismo tiempo
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
                 .skip(Number(desde))
                 .limit(Number(limite))
    ]);

    res.json({
       total,
       usuarios
    });
}

/*

    actualizar usuarios

*/


const usuariosPut = async(req, res) => {

    //solicitando desde la  url ID
    const {id} = req.params;
    //todos los datos 
    const {_id, password, google, correo, ...resto} = req.body;
    
    //tODO VALIDAR CONTRA BD
    if ( password ) {
        //Encriptar
        const salt = bcryptjs.genSaltSync();
        resto.password = bccrypyjs.hashSync( password, salt );
    }
    
    const updateUser = await Usuario.findOneAndUpdate( id, resto,{new:true});

    res.json(updateUser );
}

/*

    agregar usuarios

*/
const usuariosPost =  async(req, res) => {
    

    //capturar datos
    const { nombre, correo, password, rol }= req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    
    //Encriptar contraseña
    //SALT numero de vueltas que quiero hacer para hacer mas complicado el desencriptacion
    const salt = bcryptjs.genSaltSync();
    usuario.password = bccrypyjs.hashSync( password, salt );


    //guardar db
    //grabar reguistro
    await usuario.save();

    res.json({
        
        msg: 'POST api - controller' ,
        usuario

    });
}


/*

    Borrar Usuario

*/

  const usuariosDelete = async (req, res) => {
      
    const {id} = req.params;

    //borrado fisico
    //const usuario = await Usuario.findByIdAndDelete( id );
    //borrado logico
    const usuario = await Usuario.findByIdAndUpdate( id, {estado:false}, {new:true} );
     


    res.json({
        
       usuario

    });
}



  module.exports = {

    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete

  }