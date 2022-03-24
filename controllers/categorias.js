const { response } = require("express");


const {Categoria, Producto} = require('../models');




const obtenerCategorias = async( req,res=response )=>{


    const query = {estado:true};
    //recibir datos
    //const {q,page,limit} = req.query
    const {limite = 5, desde = 0} = req.query;
    //En find puedo filtrar los usuarios


    //arreglo co ntodas las promesas que se ejecuten
    //Promise.all  las ejecuta al mismo tiempo
    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                 .populate('usuario','nombre')
                 .skip(Number(desde))
                 .limit(Number(limite))
                    
    ]);

    res.status(200).json({
        total,
        categorias
    })

}


//obtenrCategoria ID - populate {}

const obtenerCategoria = async( req, res = response) => { 

    const query = {estado:true};

    const {id} = req.params;

    try {

        const findCategory = await Categoria.findById( id ).populate('usuario','nombre');

        res.status(201).json({
            findCategory
        });

    } catch (error) {

        console.log(error);
    }
    


}



const crearCategoria = async (req,res = response ) => {

   
    const nombre = req.body.nombre.toUpperCase();

    try {
        
        const categoriaDB = await Categoria.findOne({ nombre });
        
        if ( categoriaDB ) {

            return res.status(400).json({
                msg: `La producto ${categoriaDB.nombre}, ya existe`
            });

        }
        
        //Generar data a guardar
        const data = {

            nombre,
            usuario: req.usuario._id

        }

        //prepara la informacion
        const category= new Categoria( data );


        //Guardar DB
        await category.save();

        res.status(201).json(category)
        
    } catch (error) {
        
        console.log(error);

    }
    

}

//actualizar categoria

const updateCategory = async(req, res=response)=> {

    const{ id } = req.params;

    const {estado,usuario,...resto} = req.body;

    resto.nombre = resto.nombre.toUpperCase();

    resto.usuario = req.usuario._id;

    try {    
        
        const changeCategory= await Categoria.findOneAndUpdate( id, resto,{new:true});

        res.status(201).json({
            msg: 'Update Satisfactory',
            changeCategory
        })


    } catch (error) {

        console.log(error);

    }
}

    

//borrar categoria - logica

const deleteCategory = async(req,res=response) => {

    const { id } = req.params;


    const  delCategory = await Categoria.findByIdAndUpdate( id,{ estado:false }, {new:true })

    //usuario autenticado
    const usuarioAutenticado = req.usuario;



    res.json({
        
       delCategory,
       usuarioAutenticado

    });
 }

module.exports = {

    crearCategoria, 
    obtenerCategorias,
    obtenerCategoria,
    updateCategory,
    deleteCategory

}
