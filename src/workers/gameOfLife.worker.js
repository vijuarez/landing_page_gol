/* eslint-disable no-restricted-globals */
/**
 * Game of Life Web Worker
 * Runs Game of Life updates asynchronously (~20 FPS), independent of render thread.
 */

let aliveCells = new Set();
let gridWidth = 0;
let gridHeight = 0;
let maxAlive = 10000;
let waveTime = 0;

/**
 * Standard Conway's Game of Life step
 * Rules: 2-3 neighbors survive, exactly 3 neighbors birth
 */
function gameOfLifeStep() {
    if (aliveCells.size === 0) return;

    const neighbors = new Map();

    // Count neighbors for all cells adjacent to alive cells
    for (const cellKey of aliveCells) {
        const [x, y] = cellKey.split(',').map(Number);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = x + dx;
                const ny = y + dy;
                const nKey = `${nx},${ny}`;
                neighbors.set(nKey, (neighbors.get(nKey) || 0) + 1);
            }
        }
    }

    const nextGen = new Set();

    for (const [cellKey, count] of neighbors) {
        const isAlive = aliveCells.has(cellKey);

        // Standard rules: 2-3 neighbors survive (count includes self, so 3-4), 3 neighbors birth
        if ((isAlive && (count === 3 || count === 4)) || (!isAlive && count === 3)) {
            // Enforce grid boundaries
            const [x, y] = cellKey.split(',').map(Number);
            if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                nextGen.add(cellKey);
            }
        }
    }

    // Enforce max alive cap
    if (nextGen.size > maxAlive) {
        const arr = Array.from(nextGen);
        aliveCells = new Set(arr.slice(0, maxAlive));
    } else {
        aliveCells = nextGen;
    }
}

/**
 * Activate cells in a circular radius around a point
 */
function activateRadius(centerX, centerY, radius) {
    const toAdd = [];

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
            if (dx * dx + dy * dy <= radius * radius) {
                const x = centerX + dx;
                const y = centerY + dy;

                if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                    const key = `${x},${y}`;
                    if (!aliveCells.has(key)) {
                        toAdd.push(key);
                    }
                }
            }
        }
    }

    // Shuffle to add random cells if near cap
    for (let i = toAdd.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [toAdd[i], toAdd[j]] = [toAdd[j], toAdd[i]];
    }

    // Add until cap
    for (const key of toAdd) {
        if (aliveCells.size >= maxAlive) break;
        aliveCells.add(key);
    }
}

/**
 * Wave activation - pulsing circles from center (idle effect)
 */
function activateWave() {
    const centerX = Math.floor(gridWidth / 2);
    const centerY = Math.floor(gridHeight / 2);
    const maxRadius = Math.min(gridWidth, gridHeight) * 0.4;
    const distance = Math.sin(waveTime * 0.05) * maxRadius * 0.5 + maxRadius * 0.5;

    for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
        const x = Math.floor(centerX + Math.cos(angle) * distance);
        const y = Math.floor(centerY + Math.sin(angle) * distance);

        if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
            if (Math.random() < 0.5) {
                const key = `${x},${y}`;
                if (aliveCells.size < maxAlive) {
                    aliveCells.add(key);
                }
            }
        }
    }

    waveTime++;
}

/**
 * Spawn initial random cells to seed the simulation
 */
function spawnInitialCells(count = 500) {
    for (let i = 0; i < count && aliveCells.size < maxAlive; i++) {
        const x = Math.floor(Math.random() * gridWidth);
        const y = Math.floor(Math.random() * gridHeight);
        aliveCells.add(`${x},${y}`);
    }
}

// Main loop (~50ms tick = ~20 FPS)
let intervalId = null;

function startLoop() {
    if (intervalId) return;
    intervalId = setInterval(() => {
        gameOfLifeStep();
        self.postMessage({ aliveCells: Array.from(aliveCells) });
    }, 50);
}

// Message handler
self.onmessage = (e) => {
    const { type, ...payload } = e.data;

    if (type === 'init') {
        gridWidth = payload.width;
        gridHeight = payload.height;
        maxAlive = payload.maxAlive || 10000;
        aliveCells = new Set();
        spawnInitialCells(500);
        startLoop();
    } else if (type === 'activate') {
        activateRadius(payload.centerX, payload.centerY, payload.radius || 10);
    } else if (type === 'wave') {
        activateWave();
    } else if (type === 'resize') {
        gridWidth = payload.width;
        gridHeight = payload.height;
    }
};
