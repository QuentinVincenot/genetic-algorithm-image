export { calculateAndSumDifferences, difference_between_images, sum_of_array_elements, calculateDifferences, sumDifferences };


const gpu = new GPU();


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


const calculateDifferences = gpu.createKernel(function(current_pixels, target_pixels) {
    let sum=0;
    for(let pixel_value=0; pixel_value<3; pixel_value++) {
        sum += Math.abs(current_pixels[this.thread.y][this.thread.x][pixel_value] - target_pixels[this.thread.y][this.thread.x][pixel_value]);
    }
    return sum;
}, {
    output: [300, 200]
});

const sumDifferences = gpu.createKernel(function(differences) {
    let sum=0;
    for(let y=0; y<this.constants.height; y++) {
        for (let x=0; x<this.constants.width; x++) {
            sum += differences[y][x];
        }
    }
    return sum;
}, {
    constants: { width: 300, height: 200 },
    output: [1]
});

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


