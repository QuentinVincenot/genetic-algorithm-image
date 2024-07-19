export { draw_solution_image_in_canvas };


// Function to draw the image passed in parameter into the designated Javascript canvas
function draw_solution_image_in_canvas(canvas_context, image_solution) {
    // Create data to write the image pixels inside, before writing into the canvas
    const image_data = canvas_context.createImageData(image_solution.width, image_solution.height);

    // Iterate over the solution image, pixel by pixel
    for(let y=0; y<image_solution.height; y++) {
        for(let x=0; x<image_solution.width; x++) {
            // Find the current pixel index among the numbers
            const pixel_index = (y * image_solution.width + x) * 4;
            // Retrieve the current pixel values (red, blue, green, opacity)
            const [red, green, blue, opacity] = image_solution.pixels[y][x];

            // Initialize the pixel data with the retrieved values
            image_data.data[pixel_index] = red;
            image_data.data[pixel_index + 1] = green;
            image_data.data[pixel_index + 2] = blue;
            image_data.data[pixel_index + 3] = opacity;
        }
    }

    // Write the initialized data representing the image into the context of the canvas
    canvas_context.putImageData(image_data, 0, 0);
}


