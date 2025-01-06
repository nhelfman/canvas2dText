let glyphMap = {}; // Holds pre-rendered glyphs
let glyphWidth = 10; // Width of each glyph (assuming fixed width)
let glyphHeight = 16; // Height of each glyph
let cachedImageData = null;
let cachedWidth = 0;

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
    const combinedWidth = text.length * glyphWidth;

    if (!cachedImageData || cachedWidth !== combinedWidth) {
        cachedImageData = ctx.createImageData(combinedWidth, glyphHeight);
        cachedWidth = combinedWidth;
    }

    const combinedImageData = cachedImageData;

    // Combine glyph image data into a single ImageData buffer to reduce draw calls
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (glyphMap[char]) {
            const glyphData = glyphMap[char].data;
            for (let row = 0; row < glyphHeight; row++) {
                for (let col = 0; col < glyphWidth; col++) {
                    const glyphIndex = (row * glyphWidth + col) * 4;
                    const combinedIndex = (row * combinedWidth + (i * glyphWidth + col)) * 4;
                    combinedImageData.data[combinedIndex] = glyphData[glyphIndex];
                    combinedImageData.data[combinedIndex + 1] = glyphData[glyphIndex + 1];
                    combinedImageData.data[combinedIndex + 2] = glyphData[glyphIndex + 2];
                    combinedImageData.data[combinedIndex + 3] = glyphData[glyphIndex + 3];
                }
            }
        }
    }

    ctx.putImageData(combinedImageData, x, y);
}

export default { init, render };
