class Solution {
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

export { Solution };


