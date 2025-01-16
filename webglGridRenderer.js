import Text from "https://esm.sh/gl-text";


let glText;
let offScreen;
let offScreenCtx;
let targetCanvas;
let targetCtx; 

function init(canvas) {
    targetCanvas = canvas;
    targetCtx = targetCanvas.getContext('2d');
    offScreen = new OffscreenCanvas(targetCanvas.width, targetCanvas.height);

    offScreenCtx = offScreen.getContext('webgl');
    glText = new Text(offScreenCtx);

    // prepare atlas of glyphs
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!? _:"; // Supported chars
    glText.update({ 
        text: chars, 
        font: '12px Helvetica, sans-serif',
        kerning: false
    });
}

function renderGrid(char) {
    // clear offscreen canvas
    clearCanvas(offScreenCtx);

    const positions = [];
    const cells = [];

    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            const cellText = `${char}: ${i}_${27-j}`;
            cells.push(cellText);

            const position = [i * 80, j * 20];
            positions.push(position);
        }
    }

    glText.update({
        position: positions,
        text: cells,
        font: '12px Helvetica, sans-serif',
        kerning: false,
    });

    glText.render();

    targetCtx.drawImage(offScreen, 0, 0);
}

function clearCanvas(gl) {
    // Set the clear color to black, fully opaque
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export default { init, renderGrid };