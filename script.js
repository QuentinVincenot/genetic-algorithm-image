// Retrieve the button to start the animation
const start_button = document.getElementById('startButton');


// Add an event listener on the 'Start' button to begin the animation
start_button.addEventListener('click', () => {
    start_button.disabled = true;
    updateCanvas('myCanvas');
});

// Fonction pour générer un tableau 3D avec des couleurs aléatoires
function generateRandomImageArray(width, height) {
    return new Array(height).fill(null).map(() => 
        new Array(width).fill(null).map(() => 
            [Math.random() * 255, Math.random() * 255, Math.random() * 255]
        )
    );
}

// Fonction pour dessiner l'image sur le canevas
function drawImage(canvasId, imageArray) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixelIndex = (y * width + x) * 4;
            const [r, g, b] = imageArray[y][x];
            imageData.data[pixelIndex] = r;       // Red
            imageData.data[pixelIndex + 1] = g;   // Green
            imageData.data[pixelIndex + 2] = b;   // Blue
            imageData.data[pixelIndex + 3] = 255; // Alpha (opaque)
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// Fonction pour mettre à jour l'image toutes les 250 millisecondes
function updateCanvas(canvasId) {
    setTimeout(() => {
        ITERATIONS++;
        console.log('Updating iteration', ITERATIONS);
        const imageArray = generateRandomImageArray(width, height);
        drawImage(canvasId, imageArray);
        if(ITERATIONS < 10) {
            //console.log('Calling next iteration...');
            setTimeout(() => {updateCanvas('myCanvas')}, 50);
        } else {
            start_button.disabled = false;
            ITERATIONS = 0;
        }
    }, 50);
}



// Exemple de tableau 3D (image de 100x100 pixels avec des couleurs aléatoires)
const width = 500;
const height = 375;
const imageArray = generateRandomImageArray(width, height);

// Dessiner l'image
drawImage('myCanvas', imageArray);

let ITERATIONS = 0;


