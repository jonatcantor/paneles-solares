require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path'); // Importa el módulo 'path'

const plantaSolarRoutes = require('./routes/plantaSolarRoutes');

const app = express();
app.use(cors());

app.use(express.json());

// Usar las rutas de la planta solar
app.use('/api/planta_solar', plantaSolarRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Exportar el manejador para Vercel
module.exports = app;