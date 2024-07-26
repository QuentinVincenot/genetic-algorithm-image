import { /*calculateAndSumDifferences, evaluateFitnessForPopulation,*/ difference_between_images, sum_of_array_elements } from "./utils.js";


const gpu = new GPU();


function flatten_matrices(matrices) {
    const numMatrices = 5;
    const numRows = 200;
    const numCols = 300;
    const numChannels = 4;
    
    const transformed = new Array(numMatrices).fill(0).map(() =>
        new Array(numRows).fill(0).map(() =>
            new Array(numCols * numChannels).fill(0)
        )
    );

    for (let m = 0; m < numMatrices; m++) {
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                for (let k = 0; k < numChannels; k++) {
                    transformed[m][i][j * numChannels + k] = matrices[m][i][j][k];
                }
            }
        }
    }

    return transformed;
}

function flatten_solution(matrix) {
    // Obtenez les dimensions
    const numRows = matrix.length;        // 2 lignes
    const numCols = matrix[0].length;     // 2 colonnes
    const numChannels = matrix[0][0].length; // 4 canaux

    // Créez une nouvelle matrice de sortie avec des dimensions 2x8
    const flattened = Array.from({ length: numRows }, () =>
        Array(numCols * numChannels).fill(0)
    );

    // Remplir la nouvelle matrice
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            for (let k = 0; k < numChannels; k++) {
                // Concaténer les canaux dans la nouvelle structure aplatie
                flattened[i][j * numChannels + k] = matrix[i][j][k];
            }
        }
    }

    return flattened;
}






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



        /*this.diffPixelsKernel = gpu.createKernel(function(flattened_solutions, target_solution) {
            // Calculate the fitness of each solution by comparing with the target solution
            return Math.abs(
                flattened_solutions[this.thread.w][this.thread.x][this.thread.y][this.thread.z] -
                target_solution[this.thread.x][this.thread.y][this.thread.z]
            );
        })
        .setOutput([number_of_solutions + crossover_number, images_height, images_width, 3]);*/
        
        /*this.sumAllPixelsKernel = gpu.createKernel(function(differenceImage) {
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
        .setConstants({width: images_width, height: images_height});*/

        /*this.parallelSum = gpu.createKernel(function(differenceImages) {
            let sum = 0;
            for (let x = 0; x < this.constants.height; x++) {
                for (let y = 0; y < this.constants.width; y++) {
                    for (let z = 0; z < 3; z++) {
                        sum += differenceImages[this.thread.x][x][y][z];
                    }
                }
            }
            return sum;
        })
        .setOutput([number_of_solutions + crossover_number])
        .setConstants({height: images_height, width: images_width});*/



        // Define a combined kernel to calculate the absolute differences and sum them
        this.allInOneSumKernel = gpu.createKernel(function(matrices, reference) {
            let sum = 0;
            for (let i = 0; i < 200; i++) {
                for (let j = 0; j < 300; j++) {
                    for (let k = 0; k < 4; k++) {
                        const diff = Math.abs(matrices[i][j][k] - reference[i][j][k]);
                        sum += diff;
                    }
                }
            }
            return sum;
        })
        .setOutput([1]);



        // Crée un kernel pour calculer la différence absolue de chaque pixel
        this.diffKernel = gpu.createKernel(function(matrices, reference) {
            const i = this.thread.y;  // Index pour les lignes
            const j = this.thread.x;  // Index pour les colonnes
            const k = this.thread.z;  // Index pour les canaux (couleurs)
            return Math.abs(matrices[i][j][k] - reference[i][j][k]);
        })
        .setOutput([200, 300, 4]);  // Dimensions basées sur les pixels et les canaux

        // Crée un kernel pour sommer les différences
        this.sumKernel = gpu.createKernel(function(differences) {
            let sum = 0;
            for (let i = 0; i < 200; i++) {
                for (let j = 0; j < 300; j++) {
                    for (let k = 0; k < 4; k++) {
                        sum += differences[i][j][k];
                    }
                }
            }
            return sum;
        })
        .setOutput([1]);



        // Crée un kernel pour calculer la différence absolue de chaque pixel
        this.batched_diffKernel = gpu.createKernel(function(matrices, reference) {
            const w = this.thread.x;  // Index pour les matrices
            const i = this.thread.y;  // Index pour les lignes
            const j = this.thread.z;  // Index pour les colonnes+canaux
            return Math.abs(matrices[w][i][j] - reference[i][j]);
        })
        .setOutput([5, 200, 1200]);  // Dimensions basées sur les pixels et les canaux

        // Crée un kernel pour sommer les différences
        this.batched_sumKernel = gpu.createKernel(function(differences) {
            const w = this.thread.x;  // Index pour les matrices
            let sum = 0;
            for (let i = 0; i < 200; i++) {
                for (let j = 0; j < 1200; j++) {
                    sum += differences[w][i][j];
                }
            }
            return sum;
        })
        .setOutput([5]);



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

        this.TEST(target_solution);

        this.TEST_GPU_JS();

        



        console.time('fitness_computation');
        let fitnesses = [];
        this.solutions_fitness = [];
        for (let i = 0; i < this.solutions.length; i++) {

            const pixels_differences = this.diffKernel(this.solutions[i].pixels, target_solution.pixels);
            const fitness = this.sumKernel(pixels_differences)[0];

            fitnesses.push(fitness);
            this.solutions_fitness.push(fitness);
        }
        console.log('raw fitnesses :', fitnesses);
        console.log('raw solutions fitnesses :', this.solutions_fitness);
        console.timeEnd('fitness_computation');



        console.time('batched_fitness_computation');
        fitnesses = [];
        this.solutions_fitness = [];
        let j=0;
        while(j < this.solutions.length) {

            let batched_solutions = [];

            let start_batch = j;
            let end_batch = Math.min(j+5, this.solutions.length);

            let element_index = start_batch;
            while(element_index < end_batch) {
                batched_solutions.push(this.solutions[element_index].pixels);
                element_index++;
            }
            while(batched_solutions.length < 5) {
                batched_solutions.push(this.solutions[element_index-1].pixels);
            }


            const flattened_batch = flatten_matrices(batched_solutions);
            const flattened_target = flatten_solution(target_solution.pixels);
            //console.log('flattened_batch', flattened_batch);
            //console.log('flattened_target', flattened_target);

            const pixels_differences = this.batched_diffKernel(flattened_batch, flattened_target);
            //console.log('pixels_differences', pixels_differences);

            const batch_fitnesses = this.batched_sumKernel(pixels_differences);
            //console.log('batch_fitnesses', batch_fitnesses);

            //console.log(batch_fitnesses);
            for(let fi=0; fi<batch_fitnesses.length; fi++) {
                fitnesses.push(batch_fitnesses[fi]);
            }

            j = end_batch;
        }
        for (let i = 0; i < j; i++) {
            this.solutions_fitness.push(fitnesses[i]);
        }
        console.log('batched fitnesses :', fitnesses);
        console.log('batched solutions fitnesses :', this.solutions_fitness);
        console.timeEnd('batched_fitness_computation');





        //const flattened_solutions_pixels = this.solutions[0].map(sol => sol.pixels);


        //const flattened_solutions = [this.solutions[0].pixels, this.solutions[1].pixels, this.solutions[2].pixels];
        //const flattened_solutions = this.solutions.map(solution => solution.pixels);
        
        //const pixels_differences = this.diffPixelsKernel(flattened_solutions, target_solution.pixels);
        //console.log('Pixels diff', pixels_differences);

        /*for(let i=0; i<this.solutions.length; i++) {
            this.solutions_fitness[i] = this.sumAllPixelsKernel(pixels_differences[i])[0];
        }*/
        
        //const parallel_sum_result = this.parallelSum(pixels_differences)[0];
        //console.log('Parallel sum', parallel_sum_result);




        
        
        /*// Evaluate the fitness of every solution in the population
        for(let i=0; i<this.solutions.length; i++) {
            this.solutions_fitness[i] = this.solutions[i].evaluate_fitness(target_solution);
        }*/
    }

    best_fitness() {
        // Determine the lowest fitness among all population solutions fitness scores
        let best_fitness = Math.min(...this.solutions_fitness);

        // Determine the solution in the population that holds this fitness score
        let best_solution = this.solutions[this.solutions_fitness.indexOf(best_fitness)];

        // Return the solution, and its fitness score, that corresponds to the best fitting image
        return {'best_solution': best_solution, 'best_fitness': best_fitness};
    }



    TEST(target_solution) {
        let total_differences = 0;

        for(let i=0; i<200; i++) {
            for(let j=0; j<300; j++) {
                for(let k=0; k<4; k++) {
                    let diff = Math.abs(this.solutions[0].pixels[i][j][k] - target_solution.pixels[i][j][k]);
                    total_differences += diff;
                }
            }
        }

        console.log('*** TEST *** :', total_differences);
    }


    TEST_GPU_JS() {
        /*----------------------------------------------------------
        *--- differenceKernel_1D_arrays
        *-----------------------------------------------------------*/
        // Kernel : difference between two 1D arrays
        const differenceKernel_1D_arrays = gpu.createKernel(function(array1, array2) {
            return Math.abs(array1[this.thread.x] - array2[this.thread.x]);
        })
        .setOutput([10]);
        // Test data for differenceKernel_1D_arrays
        const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const array2 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        console.time('differenceKernel_1D_arrays');
        const differences_a = differenceKernel_1D_arrays(array1, array2);
        console.timeEnd('differenceKernel_1D_arrays');
        console.log('differenceKernel_1D_arrays :', differences_a);

        /*----------------------------------------------------------
        *--- diffrenceKernel_2D_matrices
        *-----------------------------------------------------------*/
        // Kernel : difference between two 2D matrices
        const diffrenceKernel_2D_matrices = gpu.createKernel(function(matrix1, matrix2) {
            return matrix1[this.thread.x][this.thread.y] - matrix2[this.thread.x][this.thread.y];
        })
        .setOutput([3, 3]);
        // Test data for diffrenceKernel_2D_matrices
        const matrix1 = [[7, 7, 7], [6, 6, 6], [5, 5, 5]];
        const matrix2 = [[2, 2, 2], [4, 4, 4], [6, 6, 6]];
        console.time('diffrenceKernel_2D_matrices');
        const differences_m = diffrenceKernel_2D_matrices(matrix1, matrix2);
        console.timeEnd('diffrenceKernel_2D_matrices');
        console.log('diffrenceKernel_2D_matrices :', differences_m);

        /*----------------------------------------------------------
        *--- differenceKernel_2D_matrices_reference
        *-----------------------------------------------------------*/
        // Kernel : difference between two 2D matrices and a reference matrix
        const differenceKernel_2D_matrices_reference = gpu.createKernel(function(matrices, reference) {
            // Calculate the fitness of each solution by comparing with the target solution
            return Math.abs(matrices[this.thread.z][this.thread.x][this.thread.y] - reference[this.thread.x][this.thread.y]);
        })
        .setOutput([3, 3, 5]);
        // Test data for differenceKernel_2D_matrices_reference
        const matrices = [
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        ];
        const reference = [[7, 7, 7], [7, 7, 7], [7, 7, 7]];
        console.time('differenceKernel_2D_matrices_reference');
        const differences_r = differenceKernel_2D_matrices_reference(matrices, reference);
        console.timeEnd('differenceKernel_2D_matrices_reference');
        console.log('differenceKernel_2D_matrices_reference :', differences_r);
    }



}

export { ImageSolution, ImagePopulation };


