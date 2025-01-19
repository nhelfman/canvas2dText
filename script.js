import putImageGlyphRenderer from './putImageDataGlyphRenderer.js';
import drawImageGlyphRenderer from './drawImageGlyphRenderer.js';
import openTypeGlyphRenderer from './openTypeGlyphRenderer.js';
import parallelGridRenderer from './parallelGridRenderer.js';
import webglGridRenderer from './webglGridRenderer.js';

// Add your JavaScript code here
console.log("JavaScript file is linked successfully.");

// Helper function to get a random character
function getRandomCharacter() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return characters[Math.floor(Math.random() * characters.length)];
}

// Render text
function renderGridWithPutImage(ctx) {
    const char = getRandomCharacter();
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            putImageGlyphRenderer.render(ctx, `${char}: ${i}_${j}`, i * 80, j * 20);
        }
    }
}

function renderGridWithDrawImage(ctx) {
    const char = getRandomCharacter();
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            drawImageGlyphRenderer.render(ctx, `${char}: ${i}_${j}`, i * 80, j * 20);
        }
    }
}

function renderGridWithOpenType(ctx) {
    const char = getRandomCharacter();
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            openTypeGlyphRenderer.render(ctx, `${char}: ${i}_${j}`, i * 80, j * 20);
        }
    }
}

async function renderGridInParallel(ctx) {
    const char = getRandomCharacter();
    await parallelGridRenderer.renderGrid(ctx, char);
}

async function renderGridWithWebGL(ctx) {
    const char = getRandomCharacter();
    webglGridRenderer.renderGrid(char);
}

function renderGridWithFillText(ctx) {
    ctx.font = "OpenSans 20px monospace";
    ctx.fillStyle = "black";
    const char = getRandomCharacter();
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 28; j++) {
            ctx.fillText(`${char}: ${i}_${j}`, i * 80, j * 20 + 12);
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
    await renderFunction(ctx);
    const endRender = performance.now();

    await yieldToNextFrame();
    return endRender - startRender;
}

function updateAverageTimes(glyphRenderTimes, fillTextRenderTimes, iteration, totalIterations) {
    const avgGlyphRenderTime = glyphRenderTimes.reduce((a, b) => a + b, 0) / glyphRenderTimes.length;
    const avgFillTextRenderTime = fillTextRenderTimes.reduce((a, b) => a + b, 0) / fillTextRenderTimes.length;

    const currentIterationElem = document.getElementById("currentIteration");
    if (currentIterationElem) {
        currentIterationElem.textContent = `${iteration} / ${totalIterations}`;
        updateAverageTimesText(`${avgGlyphRenderTime.toFixed(2)} ms`, `${avgFillTextRenderTime.toFixed(2)} ms`);
    }
}

function updateAverageTimesText(glyphRenderText, fillTextRenderText, iteration, totalIterations) {
    const glyphRenderTimeElem = document.getElementById("glyphRenderTime");
    const fillTextRenderTimeElem = document.getElementById("fillTextRenderTime");

    if (glyphRenderTimeElem && fillTextRenderTimeElem) {
        glyphRenderTimeElem.textContent = glyphRenderText;
        fillTextRenderTimeElem.textContent = fillTextRenderText;
    }
}

async function renderTests(iterations) {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const fillTextCanvas = document.getElementById("fillTextCanvas");
    const fillTextCtx = fillTextCanvas.getContext("2d");

    // Initialize with desired font and color
    putImageGlyphRenderer.init(ctx, "OpenSans 20px monospace", "black");
    drawImageGlyphRenderer.init(ctx, "OpenSans 20px monospace", "black");
    await openTypeGlyphRenderer.init(ctx, './OpenSans-Regular.ttf', 10, "black");
    parallelGridRenderer.init();
    webglGridRenderer.init(canvas);

    let glyphRenderTimes = [];
    let fillTextRenderTimes = [];

    // select render test function based on the selected radio button
    const selectedTest = document.querySelector('input[name="renderer"]:checked').value;
    let renderFunction = undefined;
    switch(selectedTest) {
        case "putImage":
            renderFunction = renderGridWithPutImage;
            break;
        case "drawImage":
            renderFunction = renderGridWithDrawImage;
            break;
        case "openType":
            renderFunction = renderGridWithOpenType;
            break;
        case "parallel":
            renderFunction = renderGridInParallel;
            break;
        case "webgl":
            renderFunction = renderGridWithWebGL;
            break;
        default:
            throw new Error("Invalid test selected");
    }

    // warmup iterations
    updateAverageTimesText("Warmup", "Warmup");
    for (let i = 0; i < 10; i++) {
        await measureRenderTime(ctx, renderFunction);
        await measureRenderTime(fillTextCtx, renderGridWithFillText);
    }

    // run tests
    for (let i = 0; i < iterations; i++) {
        const fillTextRenderTime = await measureRenderTime(fillTextCtx, renderGridWithFillText);
        fillTextRenderTimes.push(fillTextRenderTime);
        await updateAverageTimes(glyphRenderTimes, fillTextRenderTimes, i + 1, iterations);
    }

    for (let i = 0; i < iterations; i++) {
        const glyphRenderTime = await measureRenderTime(ctx, renderFunction);
        glyphRenderTimes.push(glyphRenderTime);
        await updateAverageTimes(glyphRenderTimes, fillTextRenderTimes, i + 1, iterations);
    }

    console.log("done");
}

window.addEventListener('load', function() {
    const iterationsInput = document.getElementById("iterationsInput");
    renderTests(parseInt(iterationsInput.value, 10) || 50);

    const rerenderButton = document.getElementById("rerenderButton");
    rerenderButton.addEventListener("click", () => {
        const iterations = parseInt(iterationsInput.value, 10) || 50;
        renderTests(iterations);
    });

    document.querySelectorAll('input[name="renderer"]').forEach((input) => {
        input.addEventListener('change', (event) => {
            document.getElementById('selectedRenderer').textContent = event.target.value;
        });
    });
});
