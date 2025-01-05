// Add your JavaScript code here
console.log("JavaScript file is linked successfully.");

const GlyphRenderer = (function () {
    let glyphMap = {}; // Holds pre-rendered glyphs
    let glyphWidth = 10; // Width of each glyph (assuming fixed width)
    let glyphHeight = 16; // Height of each glyph

    // Initialize glyph renderer
    function init(ctx, font = "16px monospace", color = "black") {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!? _:"; // Supported chars
        const offscreen = document.createElement("canvas");
        const glyphCount = chars.length;

        offscreen.width = glyphWidth * glyphCount;
        offscreen.height = glyphHeight;

        const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
        offCtx.font = font;
        offCtx.fillStyle = color;

        chars.split("").forEach((char, i) => {
            offCtx.fillText(char, i * glyphWidth, glyphHeight - 4); // Render to offscreen
            glyphMap[char] = offCtx.getImageData(
                i * glyphWidth,
                0,
                glyphWidth,
                glyphHeight
            );
        });
    }

    // Render text using putImageData
    function render(ctx, text, x, y) {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (glyphMap[char]) {
                ctx.putImageData(glyphMap[char], x + i * glyphWidth, y);
            }
        }
    }

    return { init, render };
})();

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
