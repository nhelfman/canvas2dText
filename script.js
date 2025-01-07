import GlyphRenderer from './glyphRenderer.js';
import OpenTypeGlyphRenderer from './openTypeGlyphRenderer.js';

// Add your JavaScript code here
console.log("JavaScript file is linked successfully.");

// Helper function to get a random character
function getRandomCharacter() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return characters[Math.floor(Math.random() * characters.length)];
}

// Render text
function renderGridWithGlyphRenderer(ctx) {
    const char = getRandomCharacter();
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            GlyphRenderer.render(ctx, `${char}: ${i}_${j}`, i * 80, j * 20);
        }
    }
}

function renderGridWithFillText(ctx) {
    ctx.font = "16px monospace";
    ctx.fillStyle = "black";
    const char = getRandomCharacter();
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            ctx.fillText(`${char}: ${i}_${j}`, i * 80, j * 20 + 12);
        }
    }
}

function renderGridWithOpenTypeGlyphRenderer(ctx) {
    const char = getRandomCharacter();
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            OpenTypeGlyphRenderer.render(ctx, `${char}: ${i}_${j}`, i * 80, j * 20);
        }
    }
}

function yieldToNextFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function measureRenderTime(ctx, renderFunction) {
    await yieldToNextFrame();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const startRender = performance.now();
    renderFunction(ctx);
    const endRender = performance.now();
    return endRender - startRender;
}

function updateAverageTimes(glyphRenderTimes, fillTextRenderTimes, openTypeRenderTimes, iteration, totalIterations) {
    const avgGlyphRenderTime = glyphRenderTimes.reduce((a, b) => a + b, 0) / glyphRenderTimes.length;
    const avgFillTextRenderTime = fillTextRenderTimes.reduce((a, b) => a + b, 0) / fillTextRenderTimes.length;
    const avgOpenTypeRenderTime = openTypeRenderTimes.reduce((a, b) => a + b, 0) / openTypeRenderTimes.length;

    const currentIterationElem = document.getElementById("currentIteration");
    const glyphRenderTimeElem = document.getElementById("glyphRenderTime");
    const fillTextRenderTimeElem = document.getElementById("fillTextRenderTime");
    const openTypeRenderTimeElem = document.getElementById("openTypeRenderTime");

    if (currentIterationElem && glyphRenderTimeElem && fillTextRenderTimeElem && openTypeRenderTimeElem) {
        currentIterationElem.textContent = `${iteration} / ${totalIterations}`;
        glyphRenderTimeElem.textContent = `${avgGlyphRenderTime.toFixed(2)} ms`;
        fillTextRenderTimeElem.textContent = `${avgFillTextRenderTime.toFixed(2)} ms`;
        openTypeRenderTimeElem.textContent = `${avgOpenTypeRenderTime.toFixed(2)} ms`;
    }
}

async function renderTests(iterations = 50) {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const canvas2 = document.getElementById("myCanvas2");
    const ctx2 = canvas2.getContext("2d");
    const canvas3 = document.getElementById("myCanvas3");
    const ctx3 = canvas3.getContext("2d");

    // Initialize with desired font and color
    GlyphRenderer.init(ctx, "16px monospace", "black");
    await OpenTypeGlyphRenderer.init(ctx3, './OpenSans-Regular.ttf', 14, "black");

    let glyphRenderTimes = [];
    let fillTextRenderTimes = [];
    let openTypeRenderTimes = [];

    for (let i = 0; i < iterations; i++) {
        const glyphRenderTime = await measureRenderTime(ctx, renderGridWithGlyphRenderer);
        glyphRenderTimes.push(glyphRenderTime);

        const fillTextRenderTime = await measureRenderTime(ctx2, renderGridWithFillText);
        fillTextRenderTimes.push(fillTextRenderTime);

        const openTypeRenderTime = await measureRenderTime(ctx3, renderGridWithOpenTypeGlyphRenderer);
        openTypeRenderTimes.push(openTypeRenderTime);

        updateAverageTimes(glyphRenderTimes, fillTextRenderTimes, openTypeRenderTimes, i + 1, iterations);
    }
}

window.addEventListener('load', function() {
    renderTests(10);

    const rerenderButton = document.getElementById("rerenderButton");
    rerenderButton.addEventListener("click", () => renderTests(50));
});
