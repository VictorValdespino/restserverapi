const bcryptjs = require("bcryptjs/dist/bcrypt");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuarios')

const login = async(req,res = response) => {

    const {correo, password} = req.body;

    try{

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        
        if ( !usuario ){
            
            return res.status( 400 ).json({
                msg: 'Usuario / Passwaord incorrectos - correo no valido'
            });
        }

        //Si el usuario esta activo

        if ( !usuario.estado  ){
            
            return res.status( 400 ).json({
                msg: 'Usuario / Passwaord incorrectos - estado falso'
            });
        }
        
        //Verificar contraseña
        const token = await generarJWT(usuario.id);
        console.log(token)
        
        //compareSync y comparar en BD
        const  validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){ 

            return res.status(400).json(
                {
                    msg: 'Usuario / Passwaord incorrectos - password incorrecta'
                }
            );

        }


        // ----------- Generar el JWT

        res.json({
            msg:'login ok',
            usuario,
            token
        });

    }catch ( error ) {

        return res.status(500).json({
            msg:'Hable con el administrador'
        });

    }

}


const googleSignIn = async(req, res = response) => {


   const {id_token} = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {

            const data = {
                nombre,
                correo,
                password:':p',
                img,
                google: true
            }

            usuario = new Usuario( data );

            await usuario.save();

        }

        //Si el usuario en DB
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: ' Usuario bloqueado '
            });
        }

        //generar JWT
        const token = await generarJWT(usuario.id);
       


        res.json({

            msg:'Ok',
            usuario,
            token
    
    
        });

    } catch (error) {
        

        json.status(400).json({
            ok:false,
            msg:'El token no se evrifico'
        })


    }


   

}

module. exports = {
    login,
    googleSignIn
}