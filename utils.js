export { difference_between_images, sum_of_array_elements };


function difference_between_images(image1_clamped_array, image2_clamped_array) {
    // Convert the clamped arrays of values from the two images into two standard arrays
    let image1_values = Array.from(image1_clamped_array);
    let image2_values = Array.from(image2_clamped_array);

    // Compute the difference between each pixel-dimension element-wise and return the difference array
    let difference_array = image1_values.map((e,i) => e - image2_values[i]);
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


