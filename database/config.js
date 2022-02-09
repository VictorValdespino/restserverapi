const mongoose = require('mongoose');


const dbConnection = async () => {

    try {
        
        //conexion a BD
        //await esperar a que 
        
        await mongoose.connect(process.env.MONGOROBO_CNN);

        console.log('Base de datos ONLINE');

    } catch (error) {
        
        console.log(error);
        console.log();
        console.log();

        throw new Error('Error al incializar la base datos');
    }

}

module.exports = {
    dbConnection
}