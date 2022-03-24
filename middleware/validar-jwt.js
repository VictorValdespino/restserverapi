const { response, request } = require("express");

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuarios');


const validarJWT  = async( req =request , res = response, next  ) => {

    const token = req.header('x-token');
    // verificar sie xiste token
    if(!token){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        })
    }

    try {
        
       const{uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer usuario por uid correspondiente
       const usuario  = await Usuario.findById( uid );

       

        //si usuariop no existe
        if( !usuario){

            return res.status(401).json({msg:`Usuario ${usuario.nombre} no existente`})

        }
        

       //verifcar si uid estado true
        if(!usuario.estado){

            return res.status(401).json({msg:`${usuario.estado} Token no valido`})


        }

        req.usuario = usuario;

        
        next();
    } catch (error) {

        console.log(error);

        res.status(401).json({
            msg:'Token no valido'
        })
    } 


}

module.exports ={validarJWT}