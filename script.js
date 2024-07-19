import { Solution } from "./genetic_algorithm.js";


let IMAGE_WIDTH = 500;
let IMAGE_HEIGHT = 375;

let ITERATIONS = 0;

let MAX_WIDTH = 500;
let MAX_HEIGHT = 400;


// 
const file_image_input = document.getElementById('file_image_input');

const original_image_canvas = document.getElementById('original_image_canvas');
const original_image_context = original_image_canvas.getContext('2d');

const solution_image_canvas = document.getElementById('solution_image_canvas');

//
original_image_canvas.width = MAX_WIDTH;
original_image_canvas.height = MAX_HEIGHT;
solution_image_canvas.width = MAX_WIDTH;
solution_image_canvas.height = MAX_HEIGHT;



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
            else if(image_wider_than_canvas && image_longer_than_canvas) {
                // Clear the canvas before displaying the new image
                original_image_context.clearRect(0, 0, original_image_canvas.width, original_image_canvas.height);

                // Compute differences in width and height between the canvas and the new image
                let diff_width_canvas_image = loaded_image.width - MAX_WIDTH;
                let diff_height_canvas_image = loaded_image.height - MAX_HEIGHT;

                let resize_factor = 1.0;
                if(diff_width_canvas_image >= diff_height_canvas_image) {
                    resize_factor = MAX_WIDTH / loaded_image.width;
                    let new_image_width = MAX_WIDTH;
                    let new_image_height = resize_factor * loaded_image.height;
                    
                    let start_y = 0;
                    if(new_image_height < MAX_HEIGHT) {
                        start_y = (MAX_HEIGHT - new_image_height) / 2;
                    }

                    // Display the image at the right position in the canvas
                    original_image_context.drawImage(loaded_image, 0, start_y, new_image_width, new_image_height);
                }
                /*else {

                }*/
            }

            
            /*// Initialize variables to be computed depending on the image/canvas bounds difference
            let new_canvas_width = MAX_WIDTH;
            let new_canvas_height = MAX_HEIGHT;
            let resize_factor = 1.0;
            let new_image_width = loaded_image.width;
            let new_image_height = loaded_image.height;

            let diff_width_canvas_image = loaded_image.width - MAX_WIDTH;
            let diff_height_canvas_image = loaded_image.height - MAX_HEIGHT;

            // If one of the dimension of the loaded image goes out of canvas bounds, we need to resize the image
            if(loaded_image.width > MAX_WIDTH || loaded_image.height > MAX_HEIGHT) {

                if(diff_width_canvas_image >= diff_height_canvas_image) {
                    // First case : the image is wider out of bounds, the highest resize is to be done to fit canvas width
                    resize_factor = MAX_WIDTH / loaded_image.width;
                    new_image_width = MAX_WIDTH;
                    new_image_height = resize_factor * loaded_image.height;
                } else {
                    // First case : the image is higher out of bounds, the highest resize is to be done to fit canvas height
                    resize_factor = MAX_HEIGHT / loaded_image.height;
                    new_image_width = resize_factor * loaded_image.width;
                    new_image_height = MAX_HEIGHT;
                }

                // Resize the canvas bounds after sizes difference computation
                original_image_canvas.width = new_width;
                original_image_canvas.height = new_height;
                solution_image_canvas.width = new_width;
                solution_image_canvas.height = new_height;
            }*/

            // 
            //let difference_in_width = new_canvas_width - new_image_width;
            //let difference_in_height = new_canvas_height - new_image_height;
            
            // 
            /*IMAGE_WIDTH = original_image_canvas.width;
            IMAGE_HEIGHT = original_image_canvas.height;

            // Resize the image to the right dimensions
            original_image_context.clearRect(0, 0, original_image_canvas.width, original_image_canvas.height);
            original_image_context.drawImage(loaded_image, 0.5*diff_width_canvas_image, 0.5*diff_height_canvas_image, new_image_width, new_image_height);*/

            // 
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
        const random_image_solution = new Solution(IMAGE_WIDTH, IMAGE_HEIGHT);
        drawImageSolution(canvasId, random_image_solution);
        if(ITERATIONS < 10) {
            setTimeout(() => {updateCanvas('solution_image_canvas')}, 50);
        } else {
            start_button.disabled = false;
            ITERATIONS = 0;
        }
    }, 50);
}


const random_image_solution = new Solution(IMAGE_WIDTH, IMAGE_HEIGHT);

drawImageSolution('solution_image_canvas', random_image_solution);


