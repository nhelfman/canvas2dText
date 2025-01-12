import opentype from './opentype.js';

let font, fontSize, fontColor, ctx, charCache, advanceWidthCache;

async function init(ctx, fontUrl, size, color) {
    font = await opentype.load(fontUrl);
    fontSize = size;
    fontColor = color;
    ctx = ctx;
    charCache = new Map();
    advanceWidthCache = new Map();
    ctx.fillStyle = color;
    cacheCharacterPaths();
}

function cacheCharacterPaths() {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!? _:"; // Supported chars
    for (const char of characters) {
        const path = font.getPath(char, 0, 0, fontSize);
        const advanceWidth = font.getAdvanceWidth(char, fontSize);
        charCache.set(char, path);
        advanceWidthCache.set(char, advanceWidth);
    }
}

function render(ctx, text, x, y) {
    if (!font) {
        console.error("Font not loaded");
        return;
    }
    if (charCache.size === 0) {
        cacheCharacterPaths();
    }

    ctx.fillStyle = "black";
    let offsetX = x;
    for (const char of text) {
        const path = charCache.get(char);
        const advanceWidth = 10; //this.advanceWidthCache.get(char);
        if (path && advanceWidth !== undefined) {
            path.fill = fontColor;
            path.draw2(ctx, offsetX, y);
            offsetX += advanceWidth;
        }
    }
}

export default { init, render };

