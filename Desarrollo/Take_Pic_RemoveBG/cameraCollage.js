let width = 800;
let height = 0;

let streaming = false;

let video = null;
let canvasPhoto = null;
let startButton = null;
let startMixingButton = null;
let lips = null;
let glasses = null;
let horns = null;

let db = null;
let returnButton = null;

let cameraContentarea = null;
let canvasMixArea = null;

let canvas = null;
let photo = null;

let backButton = null;
let forwardButton = null;

function startUp() {
  const combinedCanvas = document.getElementById('combinedCanvas');
  
  cameraContentarea = document.querySelector("#cameraContentarea");
  canvasMixArea = document.querySelector("#canvasMixArea");
  cameraContentarea.className = "displayBlock";
  canvasMixArea.className = "displayNone";

  video = document.querySelector("#video");
  canvasPhoto = document.querySelector("#canvasPhoto");
  photo = document.querySelector("#photo");
  startButton = document.querySelector("#startButton");
  lips = document.querySelector("#lips");
  glasses = document.querySelector("#glasses");
  horns = document.querySelector("#horns");
  db = document.querySelector("#downloadButton");
  returnButton = document.querySelector("#returnButton");
  startMixingButton = document.querySelector("#startMixingButton");

  backButton = document.querySelector("#backButton");
  forwardButton = document.querySelector("#forwardButton");

  canvas = new fabric.Canvas("c");

  startButton.addEventListener("click", takePicture, false);
  startMixingButton.addEventListener("click", startMixingFunction, false);
  db.addEventListener("click", saveImage, false);
  returnButton.addEventListener("click", returnFunction, false);
  lips.addEventListener("click", placeImage, false);
  glasses.addEventListener("click", placeImage, false);
  horns.addEventListener("click", placeImage, false);

  backButton.addEventListener("click", pushBack, false);
  forwardButton.addEventListener("click", pushForward, false);

  video.addEventListener(
    "click",
    function () {
      video.play();
    },
    false
  );

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.log("An erro has happened: " + err);
    });
  // navigator.mediaDevices.getUserMedia({video: true, audio: false})
  //  .then(function(stream) {
  //    video.srcObject = stream;
  //    video.play();
  //  })
  //  .catch(function(err) {
  //    console.log("An error occurred: " + err);
  //  });
  //

  video.addEventListener(
    "canplay",
    function (e) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvasPhoto.setAttribute("width", width);
        canvasPhoto.setAttribute("height", height);

        streaming = true;
      }
    },
    false
  );

  clearPhoto();
} //end startUp

function clearPhoto() {
  let ctx = canvasPhoto.getContext("2d");
  console.log(ctx.Image)
  ctx.fillStyle = "#fa00ff";
  ctx.fillRect(0, 0, canvasPhoto.width, canvasPhoto.height);
  let data = canvasPhoto.toDataURL("image/png");
  photo.setAttribute("src", data);
} //end clearPhoto

function takePicture() {
  let context_combined = combinedCanvas.getContext('2d');
  const imgB = new Image();
  imgB.src = 'images/FONDO.jpg';
  imgB.onload = () => {
    // Dibuja la imagen de fondo
    context_combined.drawImage(imgB, 0, 0, combinedCanvas.width, combinedCanvas.height);
  }
  let ctx = canvasPhoto.getContext("2d");
  if (width && height) {
    canvasPhoto.width = width;
    canvasPhoto.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    let data = canvasPhoto.toDataURL("image/png");
    console.log(imgB)
    //context_combined.drawImage(data, 0, 34, combinedCanvas.width, combinedCanvas.height);

    removeBackground(data);
    
    } else {
    clearPhoto();
  }
} //end takePicture

function removeBackground(imageData) {
  const apiKey = "pnkCA53sgQTCca1htxkX7MJB"; // Reemplaza con tu propia API key
  fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_file_b64: imageData.split(",")[1],
    }),
  })
    .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        photo.setAttribute("src", url);
        
      })
    .catch((err) => {
      console.error("Error al quitar el fondo: ", err);
      return(null)
    });
}

//Remove BG
/////////////////end camera
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
function startMixingFunction() {
  window.addEventListener("keyup", deleteObjectKeyboard, false);
  canvas.setBackgroundColor("rgb(161, 59, 196)");

  cameraContentarea.className = "displayNone";
  canvasMixArea.className = "displayBlock";

  //delete item stuff
  let deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  let img = document.createElement("img");
  img.src = deleteIcon;

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = "blue";
  fabric.Object.prototype.cornerStyle = "circle";

  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    position: {
      x: 0.5,
      y: -0.5,
    },
    offsetX: 16,
    offsetY: -16,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 24,
  });

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    let size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  function deleteObject(eventData, target) {
    let canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  }
  /////

  let webcamPicture = document.querySelector("#photo");
  let webcamPictureSrc = webcamPicture.getAttribute("src");
  fabric.Image.fromURL(webcamPictureSrc, function (wImg) {
    wImg.set({
      left: 50,
      top: 50,
    });
    canvas.add(wImg);
  });
} //end startMixingFunction

function deleteObjectKeyboard() {
  canvas.remove(canvas.getActiveObject());
  canvas.requestRenderAll();
} //end deleteObjectKeyboard

function pushBack() {
  canvas.sendBackwards(canvas.getActiveObject());
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  console.log("back");
} //end pushBack

function pushForward() {
  canvas.bringForward(canvas.getActiveObject());
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  console.log("forward");
} //end pushBack

function saveImage(e) {
  var d = new Date();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let td = `${
    months[d.getMonth()]
  }-${d.getDate()}-${d.getFullYear()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;

  e.target.download = `myImage-${td}.png`; //'myImage-'+td+'.png'
  e.target.href = canvas.toDataURL("image/png");
} //end saveImage

function returnFunction() {
  cameraContentarea.className = "displayBlock";
  canvasMixArea.className = "displayNone";
  canvas.clear();
  clearPhoto();
} //end returnFucntion

function placeImage(e) {
  console.log(e.currentTarget.getAttribute("src"));
  let newImg = e.currentTarget.getAttribute("src");
  fabric.Image.fromURL(newImg, function (nImg) {
    let newX = canvas.width / 2 - nImg.width / 2;
    let newY = canvas.height / 2 - nImg.height / 2;
    nImg.set({
      left: newX,
      top: newY,
    });
    canvas.add(nImg);
  });
} //end placeImage

window.addEventListener("load", startUp, false);
