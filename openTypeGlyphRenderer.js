import opentype from './opentype.js';

class OpenTypeGlyphRenderer {
    static async init(ctx, fontUrl, fontSize, color) {
        this.font = await opentype.load(fontUrl);
        this.fontSize = fontSize;
        this.color = color;
        this.ctx = ctx;
        this.charCache = new Map();
        this.advanceWidthCache = new Map();
        ctx.fillStyle = color;
        this.cacheCharacterPaths();
    }

    static cacheCharacterPaths() {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!? _:"; // Supported chars
        for (const char of characters) {
            const path = this.font.getPath(char, 0, 0, this.fontSize);
            const advanceWidth = this.font.getAdvanceWidth(char, this.fontSize);
            this.charCache.set(char, path);
            this.advanceWidthCache.set(char, advanceWidth);
        }
    }

    static render(ctx, text, x, y) {
        if (!this.font) {
            console.error("Font not loaded");
            return;
        }
        if (this.charCache.size === 0) {
            this.cacheCharacterPaths();
        }
        let offsetX = x;
        for (const char of text) {
            const path = this.charCache.get(char);
            const advanceWidth = 10; //this.advanceWidthCache.get(char);
            if (path && advanceWidth !== undefined) {
                path.fill = this.color;
                path.draw2(ctx, offsetX, y);
                offsetX += advanceWidth;
            }
        }
    }
}

export default OpenTypeGlyphRenderer;
