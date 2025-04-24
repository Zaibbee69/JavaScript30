const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo()
{
    // Getting the video from system returns a promise
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(localMediaStream => {
            
            // Setting our video on html to our live video from our pc
            video.srcObject = localMediaStream;
            
            // Playing our live video
            video.play();
        })
        // If any error occurs
        .catch(err => console.log("BOMBACLATT!! ", err));
}

function paintToCanvas()
{
    // Getting the width and height of our live video
    const { videoWidth: width, videoHeight: height } = video;

    // Setting the width and height of canvas
    canvas.width = width;
    canvas.height = height;

    // Setting the canvas to paint every 16 milliseconds
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        // Getting the pixel data from the canvas
        let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = redEffect(pixels);

        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.8;

        // pixels = greenScreen(pixels);

        // Update our canvas
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto()
{
    // Playing a sound each time a pic is taken
    snap.currentTime = 0;
    snap.play();

    // Create an image of the current canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels)
{
    for (let i = 0; i < pixels.data.length; i+=4) 
    {
        pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }

    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
  }

  function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

// Once our canvas is up and ready paint to canvas
video.addEventListener("canplay", paintToCanvas);
getVideo();