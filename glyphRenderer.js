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

export default GlyphRenderer;
