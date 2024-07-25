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

// Genetic Algorithm number of solutions to keep at the same time in the population
let ALGO_POPULATION_SIZE = 30;
// Genetic Algorithm crossover number (number of offsprings to generate at each generation)
let ALGO_CROSSOVER_NUMBER = 20;
// Genetic Algorithm mutation factor (proportion of solutions that can mutate all their pixels at each generation)
let ALGO_MUTATION_FACTOR = 0.35;
// Genetic Algorithm current number of iterations
let ALGO_ITERATIONS = 0;

// Configure the maximum amount of iterations the algorithm can go through before stopping
let MAX_ITERATIONS = 30;
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
    // Disable the 'Start' and 'Reset' buttons while the algorithm is running to avoid strange behaviours
    start_button.disabled = true;
    reset_button.disabled = true;
    document.getElementById('input_population_size').disabled = true;
    document.getElementById('input_iterations_number').disabled = true;
    document.getElementById('input_crossover_numbers').disabled = true;
    document.getElementById('input_mutation_rate').disabled = true;

    // Retrieve the algorithm parameters that were inputted by the user in the dedicated fields
    ALGO_POPULATION_SIZE = document.getElementById('input_population_size').value;
    MAX_ITERATIONS = document.getElementById('input_iterations_number').value;
    ALGO_CROSSOVER_NUMBER = document.getElementById('input_crossover_numbers').value;
    ALGO_MUTATION_FACTOR = document.getElementById('input_mutation_rate').value;

    // If an instance of the Genetic Algorithm does not exist yet, create a new one
    if(!ALGO_POPULATION) {
        // Initialize a Genetic Algorithm population with default parameters
        ALGO_POPULATION = new ImagePopulation(ALGO_POPULATION_SIZE,
            original_image_canvas.width, original_image_canvas.height,
            ALGO_CROSSOVER_NUMBER, ALGO_MUTATION_FACTOR);
    }
    
    // Retrieve the first solution as the starting best fitness among all currently available solutions
    ALGO_BEST_SOLUTION = ALGO_POPULATION.solutions[0];
    ALGO_BEST_FITNESS = ALGO_POPULATION.solutions_fitness[0];

    // Draw the best solution image in the best found solution image canvas
    draw_solution_image_in_canvas(solution_image_context, ALGO_BEST_SOLUTION);

    // Update the best solution fitness legend in the canvas
    document.getElementById('best_solution_legend').innerText = "Best solution image : fitness = " + Math.floor(ALGO_BEST_FITNESS).toString();

    // Update the canvas and launch the algorithm loop
    updateCanvas();
});



// Retrieve the button to reset the genetic algorithm
const reset_button = document.getElementById('reset_button');

// Add an event listener on the 'Reset' button to clear the algorithm status
reset_button.addEventListener('click', () => {
    // Delete the current Genetic Algorithm to start over
    ALGO_POPULATION = null;
    // Reset the current number of iterations the algorithm went through
    ALGO_ITERATIONS = 0;

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
        ALGO_ITERATIONS++; console.log('Updating iteration', ALGO_ITERATIONS);

        
        
        // Randomly make the population solutions crossover to create new solutions
        ALGO_POPULATION.crossover_population();
        
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
            document.getElementById('best_solution_legend').innerText = "Best solution image : fitness = " + Math.floor(ALGO_BEST_FITNESS).toString();
        }

        

        if(ALGO_ITERATIONS < MAX_ITERATIONS) {
            // Launch the next iteration of the algorithm
            setTimeout(() => {updateCanvas()}, UPDATE_FREQUENCY_MS);
        } else {
            // Stop the algorithm after a certain number of iterations
            start_button.disabled = false;
            reset_button.disabled = false;
            document.getElementById('input_population_size').disabled = false;
            document.getElementById('input_iterations_number').disabled = false;
            document.getElementById('input_crossover_numbers').disabled = false;
            document.getElementById('input_mutation_rate').disabled = false;
        }
    }, UPDATE_FREQUENCY_MS);
}


