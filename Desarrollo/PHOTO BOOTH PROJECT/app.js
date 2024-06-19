const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configurar el motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para la página de la cámara
app.get('/camera', (req, res) => {
  res.render('camera');
});

app.listen(port, () => {
  console.log(`Photo Booth app listening at http://localhost:${port}`);
});