const numWorkers = self.name.split('/')[1];
const currentWorker = Number.parseInt(self.name.substring(self.name.indexOf('-')+1, self.name.indexOf('/'))); 
const canvas = new OffscreenCanvas(2400, 560 / numWorkers);
const ctx = canvas.getContext('2d');

// log the worker name
console.log(self.name, currentWorker, numWorkers);

// handle message - render part of the grid
onmessage = (e) => {
    const { char, x, y, rows } = e.data;
    
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "OpenSans 20px monospace";
    ctx.fillStyle = ["black", "green", "blue", "red"][currentWorker];

    for(let i = y; i < rows+y; i++) {
        for (let j = 0; j < 30; j++) {
            ctx.fillText(`${char}: ${x+j}_${y+i}`, (x+j) * 80, (i-y) * 20 + 12);
        }
    }

    const imageBitmap = canvas.transferToImageBitmap();
    postMessage({ x, y, imageBitmap }, [imageBitmap]);
}
