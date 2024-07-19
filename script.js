import { difference_between_images, sum_of_array_elements } from "./utils.js";
import { ImagePopulation, ImageSolution } from "./genetic_algorithm.js";
import { draw_solution_image_in_canvas } from "./canvas.js";


// Retrieve the original and the solution image canvas and respective contexts
const original_image_canvas = document.getElementById('original_image_canvas');
const original_image_context = original_image_canvas.getContext('2d');
const solution_image_canvas = document.getElementById('solution_image_canvas');
const solution_image_context = solution_image_canvas.getContext('2d');

// 
let ITERATIONS = 0;



// Retrieve the button to start the animation
const start_button = document.getElementById('start_button');

// Add an event listener on the 'Start' button to begin the animation
start_button.addEventListener('click', () => {
    // Disable the 'Start' while the algorithm is running to avoid strange behaviours
    start_button.disabled = true;


    // Initialize a Genetic Algorithm population
    let population = new ImagePopulation(10, original_image_canvas.width, original_image_canvas.height);


    updateCanvas();
});



// Function to update the canvas every iteration, every set amount of time
function updateCanvas() {
    setTimeout(() => {
        // Increase the number of iterations of the genetic algorithm as a counter
        ITERATIONS++; console.log('Updating iteration', ITERATIONS);

        // Create a completely random solution for the genetic algorithm
        const random_image_solution = new ImageSolution(original_image_canvas.width, original_image_canvas.height);
        // Draw the image on the second canvas, for comparison with the original image
        draw_solution_image_in_canvas(solution_image_context, random_image_solution);


        const original_image_data = original_image_context.getImageData(0, 0, original_image_canvas.width, original_image_canvas.height);
        const original_pixels = original_image_data.data;
        console.log('Original', original_pixels.length / 4);

        const solution_image_data = solution_image_context.getImageData(0, 0, solution_image_canvas.width, solution_image_canvas.height);
        const solution_pixels = solution_image_data.data;
        console.log('Solution', solution_pixels.length / 4);

        console.log('Same', sum_of_array_elements(difference_between_images(original_pixels - original_pixels)));
        console.log('Diff', sum_of_array_elements(difference_between_images(original_pixels - solution_pixels)));


        if(ITERATIONS < 10) {
            // Launch the next iteration of the algorithm
            setTimeout(() => {updateCanvas()}, 50);
        } else {
            // Stop the algorithm after a certain number of iterations
            start_button.disabled = false;
            ITERATIONS = 0;
        }
    }, 50);
}



// Create a completely random solution for the genetic algorithm
const random_image_solution = new ImageSolution(original_image_canvas.width, original_image_canvas.height);

// Draw the image on the second canvas, for comparison with the original image
draw_solution_image_in_canvas(solution_image_context, random_image_solution);


