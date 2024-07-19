import { Solution } from "./genetic_algorithm.js";


// Canvas size configuration constants
let MAX_WIDTH = 500;
let MAX_HEIGHT = 400;


// Retrieve the original and the solution image canvas and respective contexts
const original_image_canvas = document.getElementById('original_image_canvas');
const original_image_context = original_image_canvas.getContext('2d');
const solution_image_canvas = document.getElementById('solution_image_canvas');
const solution_image_context = solution_image_canvas.getContext('2d');

// Initialize the canvas sizes to the configured ones
original_image_canvas.width = MAX_WIDTH;
original_image_canvas.height = MAX_HEIGHT;
solution_image_canvas.width = MAX_WIDTH;
solution_image_canvas.height = MAX_HEIGHT;

// 
let ITERATIONS = 0;


// Retrieve the file input element that permits to change the image displayed in the canvas
const file_image_input = document.getElementById('file_image_input');

// 
file_image_input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        // Load the selected image and retrieve its dimensions
        const loaded_image = new Image();
        loaded_image.onload = function() {

            // Determine whether the new image is wider or longer than the canvas
            let image_wider_than_canvas = (loaded_image.width > MAX_WIDTH);
            let image_longer_than_canvas = (loaded_image.height > MAX_HEIGHT);

            if(!image_wider_than_canvas && !image_longer_than_canvas) {
                // Clear the canvas before displaying the new image
                original_image_context.clearRect(0, 0, original_image_canvas.width, original_image_canvas.height);
                
                // Find the position where to display the new image at the center
                let start_x = (MAX_WIDTH - loaded_image.width) / 2;
                let start_y = (MAX_HEIGHT - loaded_image.height) / 2;

                // Display the image at the right position in the canvas
                original_image_context.drawImage(loaded_image, start_x, start_y, loaded_image.width, loaded_image.height);
            }
            else if(image_wider_than_canvas || image_longer_than_canvas) {
                // Clear the canvas before displaying the new image
                original_image_context.clearRect(0, 0, original_image_canvas.width, original_image_canvas.height);

                // Compute differences in width and height between the canvas and the new image
                let diff_width_canvas_image = loaded_image.width - MAX_WIDTH;
                let diff_height_canvas_image = loaded_image.height - MAX_HEIGHT;

                let resize_factor = 1.0;
                if(diff_width_canvas_image >= diff_height_canvas_image) {
                    // Compute the resize factor depending on the ratio between the image and the canvas
                    resize_factor = MAX_WIDTH / loaded_image.width;
                    // Compute the new image dimensions based on the resizing and the resize factor
                    let new_image_width = MAX_WIDTH;
                    let new_image_height = resize_factor * loaded_image.height;
                    
                    // Find the appropriate y starting point to center vertically
                    let start_y = 0;
                    if(new_image_height < MAX_HEIGHT) {
                        start_y = (MAX_HEIGHT - new_image_height) / 2;
                    }

                    // Display the image at the right position in the canvas
                    original_image_context.drawImage(loaded_image, 0, start_y, new_image_width, new_image_height);
                }
                else {
                    // Compute the resize factor depending on the ratio between the image and the canvas
                    resize_factor = MAX_HEIGHT / loaded_image.height;
                    // Compute the new image dimensions based on the resizing and the resize factor
                    let new_image_width = resize_factor * loaded_image.width;
                    let new_image_height = MAX_HEIGHT;

                    // Find the appropriate x starting point to center horizontally
                    let start_x = 0;
                    if(new_image_width < MAX_WIDTH) {
                        start_x = (MAX_WIDTH - new_image_width) / 2;
                    }

                    // Display the image at the right position in the canvas
                    original_image_context.drawImage(loaded_image, start_x, 0, new_image_width, new_image_height);
                }
            }

            // Retrieve the pixels from the image displayed in the canvas
            const imageData = original_image_context.getImageData(0, 0, original_image_canvas.width, original_image_canvas.height);
            const pixels = imageData.data;
            console.log(pixels.length / 4);
        };
        loaded_image.src = e.target.result;
    };

    reader.readAsDataURL(file);
})





// Retrieve the button to start the animation
const start_button = document.getElementById('start_button');

// Add an event listener on the 'Start' button to begin the animation
start_button.addEventListener('click', () => {
    start_button.disabled = true;
    updateCanvas('solution_image_canvas');
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
        const random_image_solution = new Solution(original_image_canvas.width, original_image_canvas.height);
        drawImageSolution(canvasId, random_image_solution);
        if(ITERATIONS < 10) {
            setTimeout(() => {updateCanvas('solution_image_canvas')}, 50);
        } else {
            start_button.disabled = false;
            ITERATIONS = 0;
        }
    }, 50);
}


// Create a completely random solution for the genetic algorithm
const random_image_solution = new Solution(original_image_canvas.width, original_image_canvas.height);

// Draw the image on the second canvas, for comparison with the original image
drawImageSolution('solution_image_canvas', random_image_solution);


