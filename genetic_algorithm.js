import { difference_between_images, sum_of_array_elements } from "./utils.js";


class ImageSolution {
    constructor(width, height, pixels = null) {
        // Save the attributes of the image solution
        this.width = width;
        this.height = height;

        if(pixels && (pixels.length === (width * height * 4))) {
            // Initialize an empty array of pixels for starter
            this.pixels = new Array(height).fill(null).map(() =>
                new Array(width).fill(null).map(() =>
                    [null, null, null, 255]
                )
            );

            // Fill the empty array of pixels element-wise with the flattened pixels array received
            for(let i=0; i<pixels.length; i=i+4) {
                // Retrieve the current value pixel index, pixel row and pixel column
                let pixel_index = Math.floor(i / (width * 4));
                let pixel_row = Math.floor(pixel_index / width);
                let pixel_column = pixel_index % width;

                // Fill the array of pixels with the corresponding pixels values (red/green/blue/opacity)
                this.pixels[pixel_row][pixel_column] = [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]];
            }
        }
        else if(pixels === null) {
            // Initialize a completely random opaque image, that are the pixels of the image solution
            this.pixels = new Array(height).fill(null).map(() =>
                new Array(width).fill(null).map(() =>
                    // Create the red/green/blue/opacity pixels levels of the image
                    [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255]
                )
            );
        }
    }

    evaluate_fitness(target_solution) {
        
        let sum_of_differences_pixels = 0;

        for(let row=0; row<this.height; row++) {
            for(let col=0; col<this.width; col++) {
                for(let pixel_value=0; pixel_value<4; pixel_value++) {
                    sum_of_differences_pixels += Math.abs(this.pixels[row][col][pixel_value] - target_solution.pixels[row][col][pixel_value]);
                }
            }
        }

        return sum_of_differences_pixels;


        
        /*// Retrieve and flatten the arrays of pixels of both images
        let target_solution_pixels_flattened = target_solution.pixels.flat(Infinity);
        let current_solution_pixels_flattened = this.pixels.flat(Infinity);

        // Return the fitness of the current solution defined as sum of absolute differences between images, pixel-wise
        return sum_of_array_elements(difference_between_images(
            target_solution_pixels_flattened, current_solution_pixels_flattened
        ));*/
    }
}

class ImagePopulation {
    constructor(number_of_solutions, images_width, images_height) {
        // Save the number of solutions a population can have at a given time
        this.number_of_solutions = number_of_solutions;
        // Save the attributes of an image solution
        this.images_width = images_width;
        this.images_height = images_height;

        // Initialize the starting solutions of the population
        this.solutions = [];
        this.solutions_fitness = [];
        this.initialize_population();
    }

    initialize_population() {
        // Initialize a population of N starting solutions, number given at the population creation
        for(let i=0; i<this.number_of_solutions; i++) {
            // Create the current random solution
            let current_solution = new ImageSolution(this.images_width, this.images_height, null);
            // Add the created random solution to the population list of solutions
            this.solutions.push(current_solution);
        }
        
        // Initialize the array of solutions fitness with highest numbers, that should be updated later on
        this.solutions_fitness = new Array(this.number_of_solutions).fill(Infinity);
    }

    evaluate_solutions_fitness(target_solution) {
        // Evaluate the fitness of every solution in the population
        for(let i=0; i<this.number_of_solutions; i++) {
            this.solutions_fitness[i] = this.solutions[i].evaluate_fitness(target_solution);
        }
    }

    best_fitness() {
        // Determine the lowest fitness among all population solutions fitness scores
        let best_fitness = Math.min(...this.solutions_fitness);
        // Determine the solution in the population that holds this fitness score
        let best_solution = this.solutions[this.solutions_fitness.indexOf(best_fitness)];

        // Return the solution, and its fitness score, that corresponds to the best fitting image
        return {'best_solution': best_solution, 'best_fitness': best_fitness};
    }
}

export { ImageSolution, ImagePopulation };


