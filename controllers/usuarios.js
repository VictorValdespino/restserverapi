const { response } = require('express');



const  usuariosGet = (req, res) => {


    //recibir datos
    const {q,page,limit} = req.query

    res.json({
        
        msg: 'GET api - controller',
        q,
        page,
        limit

    });
}


const usuariosPut = (req, res) => {

    //solicitando desde la url
    const {id} = req.params

    res.json({
        
        msg: 'PUT api - controller',
        id: id 

    });
}


const usuariosPost =  (req, res) => {

    const body = req.body;

    res.json({
        
        msg: 'POST api - controller' ,
        body

    });
}

  const usuariosDelete = (req, res) => {
    res.json({
        
        msg: 'DELETE api - controller' 

    });
}



  module.exports = {

    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete

  }