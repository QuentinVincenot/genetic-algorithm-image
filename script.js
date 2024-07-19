import { Solution } from "./genetic_algorithm.js";


const IMAGE_WIDTH = 500;
const IMAGE_HEIGHT = 375;
let ITERATIONS = 0;


// Retrieve the button to start the animation
const start_button = document.getElementById('startButton');

// Add an event listener on the 'Start' button to begin the animation
start_button.addEventListener('click', () => {
    start_button.disabled = true;
    updateCanvas('myCanvas');
});


// Function to draw the image passed in parameter into the designated Javascript canvas
function drawImageSolution(canvasId, image_solution) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(image_solution.width, image_solution.height);
    for(let y=0; y<image_solution.height; y++) {
        for(let x=0; x<image_solution.width; x++) {
            const pixelIndex = (y * image_solution.width + x) * 4;
            const [r, g, b, o] = image_solution.pixels[y][x];
            imageData.data[pixelIndex] = r;
            imageData.data[pixelIndex + 1] = g;
            imageData.data[pixelIndex + 2] = b;
            imageData.data[pixelIndex + 3] = o;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// Function to update the canvas every iteration, every set amount of time
function updateCanvas(canvasId) {
    setTimeout(() => {
        ITERATIONS++;
        console.log('Updating iteration', ITERATIONS);
        const random_image_solution = new Solution(IMAGE_WIDTH, IMAGE_HEIGHT);
        drawImageSolution(canvasId, random_image_solution);
        if(ITERATIONS < 10) {
            setTimeout(() => {updateCanvas('myCanvas')}, 50);
        } else {
            start_button.disabled = false;
            ITERATIONS = 0;
        }
    }, 50);
}


const random_image_solution = new Solution(IMAGE_WIDTH, IMAGE_HEIGHT);

drawImageSolution('myCanvas', random_image_solution);


