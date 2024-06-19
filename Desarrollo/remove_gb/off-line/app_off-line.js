// app.js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const captureButton = document.getElementById('capture');

// Acceder a la cámara del usuario
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error al acceder a la cámara: ', err);
    });

// Cargar el modelo de BodyPix
let net;
async function loadBodyPix() {
    net = await bodyPix.load();
    console.log('BodyPix model loaded.');
}
loadBodyPix();

// Capturar la imagen cuando se presiona el botón
captureButton.addEventListener('click', async () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Obtener la imagen del canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Quitar el fondo usando BodyPix
    const segmentation = await net.segmentPerson(imageData, {
        internalResolution: 'medium',
        segmentationThreshold: 0.7
    });

    const maskBackground = true;
    const backgroundDarkeningMask = bodyPix.toMask(segmentation, {r: 0, g: 0, b: 0, a: 0}, {r: 0, g: 0, b: 0, a: 255}, maskBackground);

    bodyPix.drawMask(output, canvas, backgroundDarkeningMask, 1, 0, false);
});
