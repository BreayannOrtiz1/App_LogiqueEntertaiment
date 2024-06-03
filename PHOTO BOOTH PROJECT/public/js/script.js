const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const countdown = document.getElementById('countdown');
const context = canvas.getContext('2d');

// Acceder a la cámara web
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing webcam: ", err);
  });

// Configurar el video de cuenta regresiva
countdown.src = '../media/cout_down.mp4'// Asegúrate de que el video esté en esta ruta

// Tomar foto
snap.addEventListener('click', () => {
  countdown.style.display = 'block';
  countdown.play();
  countdown.onended = () => {
    countdown.style.display = 'none';
    context.drawImage(video, 0, 0, 640, 480);
    canvas.style.display = 'block';
    video.style.display = 'none';
  };
});