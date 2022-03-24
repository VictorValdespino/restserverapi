
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const {Usuario, Producto} = require('../models');



const cargarArchivo = async( req,res = response )=>{



  //const extencionesV = ['txt','md']
  
  try {
    const nombre = await subirArchivo(req.files, undefined,'imgs');
    res.json({nombre})   
  } catch (msg) {
    res.status(400).json(msg);
  }
 


  

}

const actualizarImagen = async( req, res = response ) => {

  const { id, coleccion } = req.params;


  let modelo;

  switch (coleccion) {
    case 'usuarios':

      modelo = await Usuario.findById(id);

      if ( !modelo ) {

        return res.status(400).json({

          msg: ` No existe un usuario con ese ${id}`

        })

      }

      break;
      case 'productos':

        modelo = await Producto.findById(id);

        if ( !modelo ) {
  
          return res.status(400).json({
  
            msg: ` No existe un producto con ese ${id} `
  
          })
  
        }
  
        break;
  
    default:
      return res.status(500).json({msg:'se me olvido algo'})
      break;
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    //hay que borrar img del servidor
    //path de la imgen
    const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img);
    //si existe
    if ( fs.existsSync( pathImagen ) ) {
      fs.unlinkSync(pathImagen);
    }

  }
 
  const nombre = await subirArchivo(req.files, undefined,coleccion); 

  modelo.img = nombre;
  
  
  await modelo.save();

  res.json({modelo})

}

const mostrarImagen = async(req, res=response) => {

  const { id, coleccion } = req.params;


  let modelo;

  switch (coleccion) {
    case 'usuarios':

      modelo = await Usuario.findById(id);

      if ( !modelo ) {

        return res.status(400).json({

          msg: ` No existe un usuario con ese ${id}`

        })

      }

      break;
      case 'productos':

        modelo = await Producto.findById(id);

        if ( !modelo ) {
  
          return res.status(400).json({
  
            msg: ` No existe un producto con ese ${id} `
  
          })
  
        }
  
        break;
  
    default:
      return res.status(500).json({msg:'se me olvido algo'})
    
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    //hay que borrar img del servidor
    //path de la imgen
    console.log(modelo.img)
    const pathImagen = path.join(__dirname, '../uploads',coleccion, modelo.img);
    console.log(pathImagen);
    //si existe
    if ( fs.existsSync( pathImagen ) ) {
      return res.sendFile( pathImagen );
    }

  }

  const pathImagenERR = path.join(__dirname, '../assets/no-image.jpg');
 
  res.sendFile(pathImagenERR)


}


const actualizarImagenCloudinary = async( req, res = response ) => {

  const { id, coleccion } = req.params;


  let modelo;

  switch (coleccion) {
    case 'usuarios':

      modelo = await Usuario.findById(id);

      if ( !modelo ) {

        return res.status(400).json({

          msg: ` No existe un usuario con ese ${id}`

        })

      }

      break;
      case 'productos':

        modelo = await Producto.findById(id);

        if ( !modelo ) {
  
          return res.status(400).json({
  
            msg: ` No existe un producto con ese ${id} `
  
          })
  
        }
  
        break;
  
    default:
      return res.status(500).json({msg:'se me olvido algo'})
      
  }


  // Limpiar imagenes previas
  if (modelo.img) {
    
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[ nombreArr.length - 1 ];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id); 
  }
  //guardar imagenes en la nube con cloudinary    
  const { tempFilePath } = req.files.archivo;
  const { secure_url }= await cloudinary.uploader.upload( tempFilePath  );

  modelo.img = secure_url;
  await modelo.save();
  res.json(modelo)

}

module.exports = {

    cargarArchivo,
    actualizarImagen,
    mostrarImagen, 
    actualizarImagenCloudinary

}