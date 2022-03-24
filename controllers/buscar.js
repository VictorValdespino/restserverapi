const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const {Usuario,Categoria,Producto}  = require('../models')


const coleccionesPermitidas = [

    'usuarios',
    'categorias',
    'productos',
    'roles'

];


//busqueda de usuario
const buscarUsuarios = async( termino = '', res = response ) => {

    //si es  un mongo ID
    const esMongoId =  ObjectId.isValid( termino );

    const query = {estado:true};

    if ( esMongoId ) {
        //busqueda en a BD
        const usuario = await Usuario.findById(termino);

        //respuesta exitosa
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });

    }
    //busqueda sea insensible a mayusculas o minusculas
    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({

        $or:[{nombre: regex},{correo:regex}],
        $and: [query]
    });

    res.json({
        results: usuarios
    });


}



//busqueda de usuario
const buscarCategorias = async( termino = '', res = response ) => {

    //si es valido
    const esMongoId =  ObjectId.isValid( termino );

    const query = {estado:true};

    if ( esMongoId ) {

        const categoria = await Categoria.findById(termino);


        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });

    }
    //busqueda sea insensible a mayusculas o minusculas
    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({

        $or:[{nombre: regex}],
        $and: [query]
    });

    res.json({
        results: categorias
    });


}


//busqueda de usuario
const buscarProductos = async( termino = '', res = response ) => {

    //si es valido
    const esMongoId =  ObjectId.isValid( termino );

    const query = {estado:true};

    if ( esMongoId ) {

        const producto = await Producto.findById(termino)
                                        .populate('categoria','nombre');


        return res.json({
            results: ( producto ) ? [ producto ] : []
        });

    }
    //busqueda sea insensible a mayusculas o minusculas
    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({

        $or:[{nombre: regex}],
        $and: [query]
    }).populate('categoria','nombre');

    res.json({
        results: productos
    });


}

const buscar = (req, res = response) => {

    const { coleccion, termino}= req.params;



    if (!coleccionesPermitidas.includes(coleccion)) {

        return res.status(400).json({
            msg:`las colecciones permitidas son: ${coleccionesPermitidas}`
        })

    }



    switch (coleccion) {
        case 'usuarios':
            
            buscarUsuarios(termino,res);

            break;
        case 'categorias':

            buscarCategorias(termino,res);

            break;
        case 'productos':

            buscarProductos( termino,res );
        
            break;
        default:

            res.status(500).json({
                msg:'error en la busqueda'
            });

            break;
    }


}



module.exports = {

    buscar

}