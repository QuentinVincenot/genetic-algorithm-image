class ImageSolution {
    constructor(width, height) {
        // Save the attributes of the image solution
        this.width = width;
        this.height = height;
        // Initialize a completely random opaque image, that are the pixels of the image solution
        this.pixels = new Array(height).fill(null).map(() =>
            new Array(width).fill(null).map(() =>
                // Create the red/green/blue/opacity pixels levels of the image
                [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255]
            )
        );
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
        this.initialize_population();
    }

    initialize_population() {
        // Initialize a population of N starting solutions, number given at the population creation
        for(let i=0; i<this.number_of_solutions; i++) {
            // Create the current random solution
            let current_solution = new ImageSolution(this.images_width, this.images_height);
            // Add the created random solution to the population list of solutions
            this.solutions.push(current_solution);
        }
    }
}

export { ImageSolution, ImagePopulation };


