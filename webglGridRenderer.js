import Text from "https://esm.sh/gl-text";

let glText;

function init(canvas) {
    glText = new Text(canvas.getContext('webgl'));
}

function renderGrid(char) {
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
}

export default { init, renderGrid };