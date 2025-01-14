// render parts of the grid on multiple web workers and transfer imagebitmap objects to the main thread to for drawing
const numWorkers = 2;
const workers = [];

function init() {
    if(workers.length > 0) {
        return;
    }

    // create 4 web workers
    for(let i = 0; i < numWorkers; i++) {
        workers[i] = new Worker("worker.js", { name: `worker-${i}/${numWorkers}` });
    }
}

async function renderGrid(ctx, char) {
    ctx.font = "OpenSans 20px monospace";
    ctx.fillStyle = "black";
   
    for(let i = 0; i < numWorkers; i++) {
        const rows = 28 / numWorkers;
        workers[i].postMessage({ char, x: 0, y: i * rows, rows });
    }

    // handle message from worker
    const promises = [];
    workers.forEach((worker) => {
        const promise = new Promise((resolve) => {
            worker.onmessage = (e) => {
                const { x, y, imageBitmap } = e.data;
                ctx.drawImage(imageBitmap, x * 80, y * 20);
                resolve();
            }
        });

        promises.push(promise);
    });

    await Promise.all(promises);
}

export default { init, renderGrid };