
const Role = require('../models/role');
const {Usuario,Categoria, Producto} = require('../models')




const esRolValido = async(rol='') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol){
        throw new Error(`El rol ${rol} no es valido` )
    }
}

 //verificar si el correo existe

const emailExiste = async(correo = '') => {
    
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error(`El email -- ${correo} -- ya existe` )
    }
};

const existeUsuarioPorID = async( id ) => {
    
    const existeID = await Usuario.findById( id );
    if(!existeID){
        throw new Error(`El id -- ${correo} -- no existe` )
    }
};

const existeCategoriaPorID = async( id ) => {
    
    const existeID = await Categoria.findById( id );

    if(!existeID){
        throw new Error(`El  ${id} no existe` )
    }
};


const existeProductoPorID = async( id ) => {
    
    const existeID = await Producto.findById( id );

    if(!existeID){
        throw new Error(`El   ${id} no existe` )
    }
};


/**
 * Validar colecciones permitidas
 * 
 */


const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {


    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`)
    }  

    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoriaPorID,
    existeProductoPorID,
    coleccionesPermitidas
}