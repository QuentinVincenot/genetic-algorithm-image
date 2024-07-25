import { /*calculateAndSumDifferences, evaluateFitnessForPopulation,*/ difference_between_images, sum_of_array_elements } from "./utils.js";


const gpu = new GPU();

/*const differenceKernel = gpu.createKernel(function(array1, array2) {
    // Calculate the fitness of each solution by comparing with the target solution
    return array1[this.thread.x] - array2[this.thread.x];
})
.setOutput([10]);*/

/*const diffMatricesKernel = gpu.createKernel(function(matrix1, matrix2) {
    // Calculate the fitness of each solution by comparing with the target solution
    return matrix1[this.thread.x][this.thread.y] - matrix2[this.thread.x][this.thread.y];
})
.setOutput([3, 3]);*/

/*const diffMatricesReferenceKernel = gpu.createKernel(function(matrices, reference) {
    // Calculate the fitness of each solution by comparing with the target solution
    return matrices[this.thread.z][this.thread.x][this.thread.y] - reference[this.thread.x][this.thread.y];
})
.setOutput([5, 3, 3]);*/





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

    mutate(mutation_factor) {
        // Mutate all pixels by small amount if the solution has been chosen
        for(let row=0; row<this.height; row++) {
            for(let col=0; col<this.width; col++) {
                if(Math.random() < mutation_factor) {
                    for(let pixel_value=0; pixel_value<3; pixel_value++) {
                        // Change their pixel values (red/green/blue) by a small amount
                        this.pixels[row][col][pixel_value] += (-25 + Math.random() * 50);
                        this.pixels[row][col][pixel_value] = Math.max(0, Math.min(this.pixels[row][col][pixel_value], 255));
                    }
                }
            }
        }
    }

    evaluate_fitness(target_solution) {

        //let WID = this.width;
        //let HIG = this.height;

        //const sum_of_differences_pixels = calculateAndSumDifferences(this.pixels, target_solution.pixels)[0];
        //return sum_of_differences_pixels;
        return -1;
        
        /*// Compute the sum of differences in all pixels of both solutions, element-wise
        let sum_of_differences_pixels = 0;
        for(let row=0; row<this.height; row++) {
            for(let col=0; col<this.width; col++) {
                for(let pixel_value=0; pixel_value<3; pixel_value++) {
                    // Substract pixel values directly between the two solution images pixels
                    sum_of_differences_pixels += Math.abs(this.pixels[row][col][pixel_value] - target_solution.pixels[row][col][pixel_value]);
                }
            }
        }
        // Return the fitness of the current solution defined as sum of absolute differences between images, pixel-wise
        return sum_of_differences_pixels;*/
    }
}

class ImagePopulation {
    constructor(number_of_solutions, images_width, images_height, crossover_number, mutation_factor) {
        // Save the number of solutions a population can have at a given time
        this.number_of_solutions = number_of_solutions;
        // Save the attributes of an image solution
        this.images_width = images_width;
        this.images_height = images_height;
        // Save the crossover number and mutation factor parameters of the population
        this.crossover_number = crossover_number;
        this.mutation_factor = mutation_factor;

        // Initialize the starting solutions of the population
        this.solutions = [];
        this.solutions_fitness = [];
        this.initialize_population();



        this.diffPixelsKernel = gpu.createKernel(function(flattened_solutions, target_solution) {
            // Calculate the fitness of each solution by comparing with the target solution
            return [
                flattened_solutions[this.thread.z][this.thread.x][this.thread.y][0] - target_solution[this.thread.x][this.thread.y][0],
                flattened_solutions[this.thread.z][this.thread.x][this.thread.y][1] - target_solution[this.thread.x][this.thread.y][1],
                flattened_solutions[this.thread.z][this.thread.x][this.thread.y][2] - target_solution[this.thread.x][this.thread.y][2]
            ];
        })
        .setOutput([3, number_of_solutions + crossover_number, images_height, images_width]);
        
        this.sumAllPixelsKernel = gpu.createKernel(function(differenceImage) {
            let sum = 0;
            for (let y = 0; y < this.constants.height; y++) {
                for (let x = 0; x < this.constants.width; x++) {
                    sum += differenceImage[0][y][x];
                    sum += differenceImage[1][y][x];
                    sum += differenceImage[2][y][x];
                }
            }
            return sum;
        })
        .setOutput([1])
        .setConstants({width: images_width, height: images_height});



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
        this.solutions_fitness = new Array(this.number_of_solutions).fill(Math.pow(10, 12));
    }

    crossover_population() {
        let initial_number_of_solutions = this.number_of_solutions;
        for(let i=0; i<this.crossover_number; i++) {
            // Select randomly two different solutions of the population to be parents of the new solution to generate
            let first_solution_index = Math.floor(Math.random() * initial_number_of_solutions);
            let second_solution_index = Math.floor(Math.random() * initial_number_of_solutions);
            while(second_solution_index == first_solution_index) {
                second_solution_index = Math.floor(Math.random() * initial_number_of_solutions);
            }

            // Create a new solution that will be generated through the selected parents crossover
            let new_solution = new ImageSolution(this.images_width, this.images_height, null);
            for(let row=0; row<this.height; row++) {
                for(let col=0; col<this.width; col++) {
                    // Select randomly one parent or the other to transmit the current pixel to the offspring
                    let solution_index_to_choose = Math.floor(Math.random() * 2);
                    if(solution_index_to_choose == 0) {
                        for(let pixel_value=0; pixel_value<3; pixel_value++) {
                            // Take the current pixel of the first parent solution to create the current pixel of the offspring
                            new_solution.pixels[row][col][pixel_value] = this.solutions[first_solution_index].pixels[row][col][pixel_value];
                        }
                    } else {
                        for(let pixel_value=0; pixel_value<3; pixel_value++) {
                            // Take the current pixel of the second parent solution to create the current pixel of the offspring
                            new_solution.pixels[row][col][pixel_value] = this.solutions[second_solution_index].pixels[row][col][pixel_value];
                        }
                    }
                }
            }

            // Save the new solution generated and add it to the population list of solutions
            this.solutions.push(new_solution);
            this.solutions_fitness.push(Math.pow(10, 12));
        }
    }

    mutate_population() {
        // Mutate the offspring generated population solutions
        for(let i=this.number_of_solutions; i<this.solutions.length; i++) {
            this.solutions[i].mutate(this.mutation_factor);
        }
    }

    select_population() {
        // Delete solutions from the population one by one, to reach the desired number of solutions
        while(this.solutions.length > this.number_of_solutions) {
            // Find the index of the worst solution based on its fitness
            let worst_fitness = Math.max(...this.solutions_fitness);
            let worst_solution_index = this.solutions_fitness.indexOf(worst_fitness);
            
            // Delete this solution from the population
            this.solutions.splice(worst_solution_index, 1);
            this.solutions_fitness.splice(worst_solution_index, 1);
        }
    }

    evaluate_solutions_fitness(target_solution) {

        /*// Convertir les solutions en format compatible pour GPU
        const target_pixels = target_solution.pixels;

        // Évaluer la fitness de chaque solution
        const solutions_fitness = evaluateFitnessForPopulation(this.solutions, target_pixels, this.solutions.length);
        
        // Assigner les résultats aux solutions_fitness
        for (let i = 0; i < this.solutions.length; i++) {
            this.solutions_fitness[i] = solutions_fitness[i];
        }*/
        
        
        
        /*const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const array2 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        const differences = differenceKernel(array1, array2);
        console.log(differences);*/

        /*const matrix1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        const matrix2 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        const differences = diffMatricesKernel(matrix1, matrix2);
        console.log(differences);*/

        /*const matrices = [
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        ];
        const reference = [[7, 7, 7], [7, 7, 7], [7, 7, 7]];
        const differences = diffMatricesReferenceKernel(matrices, reference);
        console.log(differences);*/

        //const flattened_solutions_pixels = this.solutions[0].map(sol => sol.pixels);


        //const flattened_solutions = [this.solutions[0].pixels, this.solutions[1].pixels, this.solutions[2].pixels];
        const flattened_solutions = this.solutions.map(solution => solution.pixels);
        
        const pixels_differences = this.diffPixelsKernel(flattened_solutions, target_solution.pixels);

        for(let i=0; i<this.solutions.length; i++) {
            this.solutions_fitness[i] = this.sumAllPixelsKernel(pixels_differences[i]);
        }

        console.log('After eval', this.solutions_fitness);




        
        
        /*// Evaluate the fitness of every solution in the population
        for(let i=0; i<this.solutions.length; i++) {
            this.solutions_fitness[i] = this.solutions[i].evaluate_fitness(target_solution);
        }*/
    }

    best_fitness() {
        
        console.log('best_fitness 1', this.solutions.length, this.solutions_fitness);
        console.log('best_fitness 11', this.solutions);

        // Determine the lowest fitness among all population solutions fitness scores
        let best_fitness = Math.min(...this.solutions_fitness);

        console.log('best_fitness 2', best_fitness);

        // Determine the solution in the population that holds this fitness score
        let best_solution = this.solutions[this.solutions_fitness.indexOf(best_fitness)];

        console.log('best_fitness 3', best_solution);

        // Return the solution, and its fitness score, that corresponds to the best fitting image
        return {'best_solution': best_solution, 'best_fitness': best_fitness};
    }
}

export { ImageSolution, ImagePopulation };


