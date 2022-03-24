const { response } = require("express");
const { Producto } = require("../models");



const createProduct = async(req,res = response)=>{

    const {estado, usuario, ...body} = req.body;

    try {
        
        const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });
        
        if ( productoDB ) {

            return res.status(400).json({
                msg: `El producto ${productoDB.nombre}, ya existe`
            });

        }
        
        //Generar data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id

        }

        //prepara la informacion
        const producto = new Producto( data );


        //Guardar DB
        await producto.save();

        res.status(201).json(producto)
        
    } catch (error) {
        
        console.log(error);

    }



}


const getProducts = async( req,res=response )=>{


    const query = {estado:true};
    //recibir datos
    //const {q,page,limit} = req.query
    const {limite = 5, desde = 0} = req.query;
    //En find puedo filtrar los usuarios


    //arreglo co ntodas las promesas que se ejecuten
    //Promise.all  las ejecuta al mismo tiempo
    const [total,productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                 .populate('usuario','nombre')
                 .skip(Number(desde))
                 .limit(Number(limite))
                    
    ]);

    res.status(200).json({
        total,
        productos
    })

}

const getProduct = async( req, res = response) => { 

    const query = {estado:true};

    const {id} = req.params;

    try {

        const findProduct = await Producto.findById( id ).populate('usuario','nombre');

        res.status(201).json({
            findProduct
        });

    } catch (error) {

        console.log(error);
    }
    


}


const updateProduct = async(req, res=response)=> {

    const{ id } = req.params;

    const {estado,usuario,...resto} = req.body;


    if ( resto.nombre ) {

        resto.nombre = resto.nombre.toUpperCase();

    }


    resto.usuario = req.usuario._id;

    try {    
        
        const changeProduct= await Producto.findOneAndUpdate( id, resto,{new:true});

        res.status(201).json({
            msg: 'Update Satisfactory',
            changeProduct
        })


    } catch (error) {

        console.log(error);

    }
}


//borrar categoria - logica

const deleteProduct = async(req,res=response) => {

    const { id } = req.params;


    const  delProduct = await Producto.findByIdAndUpdate( id,{ estado:false }, {new:true })

    //usuario autenticado
    const usuarioAutenticado = req.usuario;



    res.json({
        
       delProduct,
       usuarioAutenticado

    });
 }

module.exports = {

    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct

}