const { response, request } = require("express");
const role = require("../models/role");


const esAdminRole = (req, res = response, next) => {

    if ( !req.usuario) {

        return res.status(500).json({
            msg:'se quiere verificar el rol sin validar antes el token'
        });

    }

    const {rol, nombre} = req.usuario;

    if( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg:`usuarios ${nombre} - ${ rol } privilegios insufisientes`
        });
    }
    
    next();
} 


const tieneRole = ( ...roles ) => {

    return (req, res=response, next) => {

        if ( !req.usuario) {

            return res.status(500).json({
                msg:'se quiere verificar el rol sin validar antes el token'
            });
    
        }

        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status(404).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        
        next();

    }

}

module.exports = { esAdminRole, tieneRole }
