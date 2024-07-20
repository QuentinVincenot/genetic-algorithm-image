import { difference_between_images, sum_of_array_elements } from "./utils.js";
import { ImagePopulation, ImageSolution } from "./genetic_algorithm.js";
import { draw_solution_image_in_canvas } from "./canvas.js";


// Retrieve the original and the solution image canvas and respective contexts
const original_image_canvas = document.getElementById('original_image_canvas');
const original_image_context = original_image_canvas.getContext('2d');
const solution_image_canvas = document.getElementById('solution_image_canvas');
const solution_image_context = solution_image_canvas.getContext('2d');

// 
let ALGO_POPULATION = null;
let ALGO_TARGET_SOLUTION = null;
let ALGO_BEST_SOLUTION = null;
let ALGO_BEST_FITNESS = Infinity;

let ALGO_MUTATION_FACTOR = 0.15;
let ITERATIONS = 0;

// Configure the algorithm loop frequency, to time the algorithm/visualization updates
let UPDATE_FREQUENCY_MS = 50;



// Retrieve the target solution image that the algorithm should try to reconstruct
let original_pixels = original_image_context.getImageData(0, 0, original_image_canvas.width, original_image_canvas.height).data;
// Build a target solution image that will serve as a reference
ALGO_TARGET_SOLUTION = new ImageSolution(original_image_canvas.width, original_image_canvas.height, Array.from(original_pixels));

// Create a completely random solution for the genetic algorithm
const random_image_solution = new ImageSolution(original_image_canvas.width, original_image_canvas.height);
// Draw the image on the second canvas, for comparison with the original image
draw_solution_image_in_canvas(solution_image_context, random_image_solution);



// Retrieve the button to start the animation
const start_button = document.getElementById('start_button');

// Add an event listener on the 'Start' button to begin the animation
start_button.addEventListener('click', () => {
    // Disable the 'Start' while the algorithm is running to avoid strange behaviours
    start_button.disabled = true;

    // Initialize a Genetic Algorithm population
    ALGO_POPULATION = new ImagePopulation(10, original_image_canvas.width, original_image_canvas.height, ALGO_MUTATION_FACTOR);
    // Evaluate the fitness of every randomly generated initial solutions of the algorithm
    ALGO_POPULATION.evaluate_solutions_fitness(ALGO_TARGET_SOLUTION);
    // Retrieve the solution with the best fitness among all currently available solutions
    let best_fitness_element = ALGO_POPULATION.best_fitness();
    ALGO_BEST_SOLUTION = best_fitness_element['best_solution'];
    ALGO_BEST_FITNESS = best_fitness_element['best_fitness'];

    // Draw the best solution image in the best found solution image canvas
    draw_solution_image_in_canvas(solution_image_context, ALGO_BEST_SOLUTION);

    // Update the best solution fitness legend in the canvas
    document.getElementById('best_solution_legend').innerText = "Best solution image : fitness = " + ALGO_BEST_FITNESS.toString();

    // Update the canvas and launch the algorithm loop
    updateCanvas();
});



// Retrieve the button to reset the genetic algorithm
const reset_button = document.getElementById('reset_button');

// Add an event listener on the 'Reset' button to clear the algorithm status
reset_button.addEventListener('click', () => {
    // Initialize a Genetic Algorithm population from scratch
    ALGO_POPULATION = new ImagePopulation(10, original_image_canvas.width, original_image_canvas.height, ALGO_MUTATION_FACTOR);

    // Create a completely random solution to initialize the solution canvas with
    const random_image_solution = new ImageSolution(original_image_canvas.width, original_image_canvas.height);
    // Draw the image on the second canvas, for comparison with the original image
    draw_solution_image_in_canvas(solution_image_context, random_image_solution);

    // Reset the best solution found legend for further algorithm execution
    document.getElementById('best_solution_legend').innerText = "Best solution image : fitness = ???";
});



// Function to update the canvas every iteration, every set amount of time
function updateCanvas() {
    setTimeout(() => {
        // Increase the number of iterations of the genetic algorithm as a counter
        ITERATIONS++; console.log('Updating iteration', ITERATIONS);

        
        
        // Randomly mutate the population based on a mutation factor proper to the population
        ALGO_POPULATION.mutate_population();
        
        // Evaluate the fitness of every randomly generated initial solutions of the algorithm
        ALGO_POPULATION.evaluate_solutions_fitness(ALGO_TARGET_SOLUTION);
        
        // Select the population to keep only the fittess solutions found
        ALGO_POPULATION.select_population();

        // Retrieve the solution of the current population, and update the canvas if a fitter solution has been found
        let best_fitness_element = ALGO_POPULATION.best_fitness();
        if(best_fitness_element['best_fitness'] < ALGO_BEST_FITNESS) {
            // Retrieve the solution image and its corresponding fitness
            ALGO_BEST_SOLUTION = best_fitness_element['best_solution'];
            ALGO_BEST_FITNESS = best_fitness_element['best_fitness'];

            // Draw the best solution image in the best found solution image canvas
            draw_solution_image_in_canvas(solution_image_context, ALGO_BEST_SOLUTION);

            // Update the best solution fitness legend in the canvas
            document.getElementById('best_solution_legend').innerText = "Best solution image : fitness = " + ALGO_BEST_FITNESS.toString();
        }



        if(ITERATIONS < 20) {
            // Launch the next iteration of the algorithm
            setTimeout(() => {updateCanvas()}, UPDATE_FREQUENCY_MS);
        } else {
            // Stop the algorithm after a certain number of iterations
            start_button.disabled = false;
            ITERATIONS = 0;
        }
    }, UPDATE_FREQUENCY_MS);
}


