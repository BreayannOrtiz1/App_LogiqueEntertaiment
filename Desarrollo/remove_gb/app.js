// app.js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const captureButton = document.getElementById('capture');
const imgNoBg = document.getElementById('imgNoBg-cont');

// Acceder a la cámara del usuario
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error al acceder a la cámara: ', err);
    });

// Capturar la imagen cuando se presiona el botón
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Obtener la imagen en base64
    const imageData = canvas.toDataURL('image/png');
    
    // Enviar la imagen a la API para quitar el fondo
    removeBackground(imageData);
});

// Función para quitar el fondo usando la API de Remove.bg
function removeBackground(imageData) {
    const apiKey = 'pnkCA53sgQTCca1htxkX7MJB'; // Reemplaza con tu propia API key
    fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image_file_b64: imageData.split(',')[1]
        })
    })
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);
        output.src = url;
        output.style.display = 'block';
        imgNoBg.src = url;
        imgNoBg.style.display = 'block';

    })
    .catch(err => {
        console.error('Error al quitar el fondo: ', err);
    });
}
