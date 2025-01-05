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

// Usage Example
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Initialize with desired font and color
GlyphRenderer.init(ctx, "16px monospace", "black");

// Render text

// render text on a grid like structure 30x28 multiple times
for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 28; j++) {
        GlyphRenderer.render(ctx, `c: ${i}_${j}`, i * 80, j * 20);
    }
}
// GlyphRenderer.render(ctx, "Hello, World!", 50, 50);
