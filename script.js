import { Solution } from "./genetic_algorithm.js";
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
    start_button.disabled = true;
    updateCanvas('solution_image_canvas');
});



// Function to update the canvas every iteration, every set amount of time
function updateCanvas(canvasId) {
    setTimeout(() => {
        // Increase the number of iterations of the genetic algorithm as a counter
        ITERATIONS++; console.log('Updating iteration', ITERATIONS);

        // Create a completely random solution for the genetic algorithm
        const random_image_solution = new Solution(original_image_canvas.width, original_image_canvas.height);
        // Draw the image on the second canvas, for comparison with the original image
        //drawImageSolution(canvasId, random_image_solution);
        draw_solution_image_in_canvas(solution_image_context, random_image_solution);

        if(ITERATIONS < 10) {
            // Launch the next iteration of the algorithm
            setTimeout(() => {updateCanvas('solution_image_canvas')}, 50);
        } else {
            // Stop the algorithm after a certain number of iterations
            start_button.disabled = false;
            ITERATIONS = 0;
        }
    }, 50);
}



// Create a completely random solution for the genetic algorithm
const random_image_solution = new Solution(original_image_canvas.width, original_image_canvas.height);

// Draw the image on the second canvas, for comparison with the original image
draw_solution_image_in_canvas(solution_image_context, random_image_solution);


