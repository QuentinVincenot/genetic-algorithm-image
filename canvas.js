import { ImageSolution } from "./genetic_algorithm.js";

export { draw_solution_image_in_canvas };


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



// Retrieve the file input element that permits to change the image displayed in the canvas
const file_image_input = document.getElementById('file_image_input');

// Change the original image and put a new solution image when an image is imported by the user
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

    // Create a completely random solution for the genetic algorithm when the original image is changed
    const random_image_solution = new ImageSolution(original_image_canvas.width, original_image_canvas.height);
    // Draw the image on the second canvas, for comparison with the original image
    draw_solution_image_in_canvas(solution_image_context, random_image_solution);
});



// Function to draw the image passed in parameter into the designated Javascript canvas
function draw_solution_image_in_canvas(canvas_context, image_solution) {
    // Create data to write the image pixels inside, before writing into the canvas
    const image_data = canvas_context.createImageData(image_solution.width, image_solution.height);

    // Iterate over the solution image, pixel by pixel
    for(let y=0; y<image_solution.height; y++) {
        for(let x=0; x<image_solution.width; x++) {
            // Find the current pixel index among the numbers
            const pixel_index = (y * image_solution.width + x) * 4;
            // Retrieve the current pixel values (red, blue, green, opacity)
            const [red, green, blue, opacity] = image_solution.pixels[y][x];

            // Initialize the pixel data with the retrieved values
            image_data.data[pixel_index] = red;
            image_data.data[pixel_index + 1] = green;
            image_data.data[pixel_index + 2] = blue;
            image_data.data[pixel_index + 3] = opacity;
        }
    }

    // Write the initialized data representing the image into the context of the canvas
    canvas_context.putImageData(image_data, 0, 0);
}


