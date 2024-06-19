let isCapturing = false;

async function startCamera(deviceId) {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const overlay = document.querySelector('.overlay');

    if (window.stream) {
        window.stream.getTracks().forEach(track => track.stop());
    }

    try {
        const constraints = {
            video: { deviceId: deviceId ? { exact: deviceId } : undefined }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        window.stream = stream;
        video.srcObject = stream;
    } catch (error) {
        console.error('Error al acceder a la cámara: ', error);
    }

    video.addEventListener('click', () => {
        if (!isCapturing) {
            isCapturing = true;
            overlay.style.display = 'flex';
            setTimeout(() => {
                takePhoto(video, canvas);
                overlay.style.display = 'none'; // Ocultar el demo después de tomar la foto
            }, 4000);
        }
    });
}

function takePhoto(video, canvas) {
    const context = canvas.getContext('2d');
    canvas.style.display = 'block';
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    isCapturing = false;
}

async function init() {
    const select = document.getElementById('cameraSelect');
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    videoDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Cámara ${select.length + 1}`;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        startCamera(select.value);
    });

    if (videoDevices.length > 0) {
        startCamera(videoDevices[0].deviceId);
    }
}

function toggleCameraSelect() {
    const cameraSelectContainer = document.getElementById('cameraSelectContainer');
    if (cameraSelectContainer.classList.contains('hidden')) {
        cameraSelectContainer.classList.remove('hidden');
    } else {
        cameraSelectContainer.classList.add('hidden');
    }
}

document.getElementById('toggleButton').addEventListener('click', toggleCameraSelect);

document.addEventListener('click', function() {
    const demo = document.querySelector('.demo');
    demo.style.display = 'block';
});

document.addEventListener('DOMContentLoaded', init);
