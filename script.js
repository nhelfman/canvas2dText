import GlyphRenderer from './glyphRenderer.js';

// Add your JavaScript code here
console.log("JavaScript file is linked successfully.");

// Render text
function renderGridWithGlyphRenderer(ctx) {
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            GlyphRenderer.render(ctx, `c: ${i}_${j}`, i * 80, j * 20);
        }
    }
}

function renderGridWithFillText(ctx) {
    ctx.font = "16px monospace";
    ctx.fillStyle = "black";
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            ctx.fillText(`c: ${i}_${j}`, i * 80, j * 20 + 12);
        }
    }
}

function yieldToNextFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function renderTests() {
    const renderTimesDiv = document.getElementById("renderTimes");
    renderTimesDiv.innerHTML = "";

    await yieldToNextFrame();
    
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Initialize with desired font and color
    GlyphRenderer.init(ctx, "16px monospace", "black");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Measure render time for GlyphRenderer
    const startGlyphRender = performance.now();
    renderGridWithGlyphRenderer(ctx);
    const endGlyphRender = performance.now();
    const glyphRenderTime = endGlyphRender - startGlyphRender;
    renderTimesDiv.innerHTML += `<div>GlyphRenderer time:</div><div>${glyphRenderTime.toFixed(2)} ms</div>`;

    // Yield to next frame
    await yieldToNextFrame();

    // Render another canvas below the first one but use ctx.fillText instead
    const canvas2 = document.getElementById("myCanvas2");
    const ctx2 = canvas2.getContext("2d");

    // Clear canvas
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    // Measure render time for fillText
    const startFillTextRender = performance.now();
    renderGridWithFillText(ctx2);
    const endFillTextRender = performance.now();
    const fillTextRenderTime = endFillTextRender - startFillTextRender;
    renderTimesDiv.innerHTML += `<div>fillText time:</div><div>${fillTextRenderTime.toFixed(2)} ms</div>`;
}

window.addEventListener('load', function() {
    renderTests();

    const rerenderButton = document.getElementById("rerenderButton");
    rerenderButton.addEventListener("click", renderTests);
});
