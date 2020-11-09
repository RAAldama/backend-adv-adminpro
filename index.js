require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

//Creación del servidor de express
const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});

//Base de Datos
dbConnection();

//Rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));