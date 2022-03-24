const { response } = require("express")


const validarArchivoSubir = (req,res = response, next) => {
    //valida si se esta subiendo un archivo, es mas de uno
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({msg:'No files were uploaded.'});
    }
    
    next();

}

module.exports = {

    validarArchivoSubir

}