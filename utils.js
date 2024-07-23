export { calculateAndSumDifferences, evaluateFitnessForPopulation, difference_between_images, sum_of_array_elements };


/*const gpu = new GPU();




const calculateAndSumDifferences = gpu.createKernel(function(current_pixels, target_pixels) {
    let sum = 0;
    for (let y = 0; y < this.constants.height; y++) {
        for (let x = 0; x < this.constants.width; x++) {
            for (let pixel_value = 0; pixel_value < 3; pixel_value++) {
                sum += Math.abs(current_pixels[y][x][pixel_value] - target_pixels[y][x][pixel_value]);
            }
        }
    }
    return sum;
}, {
    constants: { width: 300, height: 200 },
    output: [1]
});

const evaluateFitnessForPopulation = gpu.createKernel(function(solutions, target_pixels, population_size) {
    let solutions_all_fitnesses = [];
    for(let s = 0; s < population_size; s++) {
        let sum = 0;
        for (let y = 0; y < this.constants.height; y++) {
            for (let x = 0; x < this.constants.width; x++) {
                for (let pixel_value = 0; pixel_value < 3; pixel_value++) {
                    sum += Math.abs(solutions.pixels[s][y][x][pixel_value] - target_pixels[y][x][pixel_value]);
                }
            }
        }
        solutions_all_fitnesses.push(solutions_all_fitnesses);
    }
    return solutions_all_fitnesses;
    
    /*let sum = 0;
    for (let y = 0; y < this.constants.height; y++) {
        for (let x = 0; x < this.constants.width; x++) {
            for (let pixel_value = 0; pixel_value < 3; pixel_value++) {
                sum += Math.abs(solutions_pixels[this.thread.x][y][x][pixel_value] - target_pixels[y][x][pixel_value]);
            }
        }
    }
    return sum;
}, {
    constants: { width: 300, height: 200 },
    output: [50]
});*/





function difference_between_images(image1_clamped_array, image2_clamped_array) {
    // Convert the clamped arrays of values from the two images into two standard arrays
    let image1_values = Array.from(image1_clamped_array);
    let image2_values = Array.from(image2_clamped_array);

    // Compute the difference between each pixel-dimension element-wise and return the difference array
    let difference_array = image1_values.map((e,i) => Math.abs(e - image2_values[i]));
    return difference_array;
}

function sum_of_array_elements(array_values) {
    // Compute the sum of all elements in the array
    let summed_elements = array_values.reduce((accumulator, current_value) => {
        return accumulator + current_value;
    }, 0);

    // Return the computed sum of the array elements
    return summed_elements;
}


