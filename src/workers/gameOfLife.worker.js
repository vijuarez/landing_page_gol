/* eslint-disable no-restricted-globals */
/**
 * Game of Life Web Worker
 * Runs Game of Life updates asynchronously (~20 FPS), independent of render thread.
 * Tracks cell "age" for fade-in/fade-out visual effects.
 */

// ============================================
// Aging Constants (easily tunable)
// ============================================
const AGE_GAIN_RATE = 15;    // Age increase per step when alive
const AGE_DECAY_RATE = 8;   // Age decrease per step when dead
const INITIAL_AGE = 1;      // Age for newly born cells
export const MAX_AGE = 80;         // Maximum age for cells

// Simulation state (The Truth)
let aliveCells = new Set();

// Visual state (The Trail)
let cellAges = new Map();

let gridWidth = 0;
let gridHeight = 0;
let maxAlive = 10000;
let waveTime = 0;

const encodeCell = (x, y) => x + y * gridWidth;
export const decodeCell = (key, width) => {
    return [key % width, ~~(key / width)];
};

/**
 * Standard Conway's Game of Life step with age tracking
 * Rules: 2-3 neighbors survive, exactly 3 neighbors birth
 * Note: Only cells with age >= INITIAL_AGE are considered "alive" for simulation.
 *       Cells with 0 < age < INITIAL_AGE are "decaying" (visual trail only, dead for rules).
 */
function gameOfLifeStep() {
    const neighbors = new Map();

    // 1. SIMULATION STEP: Count neighbors based on aliveCells (The Truth)
    for (const cellKey of aliveCells) {
        const [x, y] = decodeCell(cellKey, gridWidth);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = x + dx;
                const ny = y + dy;
                const nKey = encodeCell(nx, ny);
                neighbors.set(nKey, (neighbors.get(nKey) || 0) + 1);
            }
        }
    }

    const nextGen = new Set();

    for (const [cellKey, count] of neighbors) {
        const isAlive = aliveCells.has(cellKey);

        // Standard rules: 2-3 neighbors survive (count includes self), 3 neighbors birth
        if ((isAlive && (count === 3 || count === 4)) || (!isAlive && count === 3)) {
            // Enforce grid boundaries
            const [x, y] = decodeCell(cellKey, gridWidth);
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

    // 2. VISUALIZATION STEP: Update ages based on new aliveCells
    const nextAges = new Map();

    // Process all currently visible cells (alive or decaying)
    // We need to check both the new alive cells AND the old visible cells
    const allKeys = new Set([...aliveCells, ...cellAges.keys()]);

    for (const key of allKeys) {
        const isNowAlive = aliveCells.has(key);
        const currentAge = cellAges.get(key) || 0;
        let newAge = 0;

        if (isNowAlive) {
            // Alive: Gain age, capped at MAX_AGE
            newAge = Math.min(currentAge + AGE_GAIN_RATE, MAX_AGE);
        } else {
            // Dead: Decay
            newAge = currentAge - AGE_DECAY_RATE;
        }

        // Keep if visible
        if (newAge > 0) {
            nextAges.set(key, newAge);
        }
    }

    cellAges = nextAges;
}

/**
 * Dual-Zone Interaction:
 * - Inner Radius (<= 2): Eraser (kills cells, resets age)
 * - Outer Radius (> 2): Creator (spawns new cells)
 */
function activateRadius(centerX, centerY, radius) {
    const innerRadius = 3; // Eraser size

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
            const distSq = dx * dx + dy * dy;

            if (distSq <= radius * radius) {
                const x = centerX + dx;
                const y = centerY + dy;
                const key = encodeCell(x, y);

                // Check if inside inner eraser radius
                if (distSq <= innerRadius * innerRadius) {
                    // ERASER: Kill cell and clear trail
                    if (aliveCells.has(key)) aliveCells.delete(key);
                    if (cellAges.has(key)) cellAges.delete(key);
                } else {
                    // CREATOR: Spawn new cell if space available
                    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                        if (!aliveCells.has(key)) {
                            if (aliveCells.size < maxAlive) {
                                aliveCells.add(key);
                                if (!cellAges.has(key)) {
                                    cellAges.set(key, INITIAL_AGE);
                                }
                            }
                        } else {
                            cellAges.set(key, Math.min(cellAges.get(key) + Math.floor(AGE_GAIN_RATE / 3), MAX_AGE));
                        }
                    }
                }
            }
        }
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
                const key = encodeCell(x, y);
                if (aliveCells.size < maxAlive) {
                    aliveCells.add(key);
                    if (!cellAges.has(key)) {
                        cellAges.set(key, INITIAL_AGE);
                    }
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
    let added = 0;
    while (added < count && aliveCells.size < maxAlive) {
        const x = Math.floor(Math.random() * gridWidth);
        const y = Math.floor(Math.random() * gridHeight);
        const key = encodeCell(x, y);
        if (!aliveCells.has(key)) {
            aliveCells.add(key);
            cellAges.set(key, INITIAL_AGE);
            added++;
        }
    }
}

// Main loop (~50ms tick = ~20 FPS)
let intervalId = null;

function startLoop() {
    if (intervalId) return;
    intervalId = setInterval(() => {
        gameOfLifeStep();
        // Send cell ages as array of [key, age] pairs
        self.postMessage({
            cellAges: Array.from(cellAges.entries())
        });
    }, 50);
}

// Message handler
self.onmessage = (e) => {
    const { type, ...payload } = e.data;

    if (type === 'init') {
        console.log(payload)
        gridWidth = payload.width;
        gridHeight = payload.height;
        maxAlive = payload.maxAlive || 10000;
        aliveCells = new Set();
        cellAges = new Map();
        spawnInitialCells(500);
        startLoop();
    } else if (type === 'activate') {
        activateRadius(payload.centerX, payload.centerY, payload.radius);
    } else if (type === 'wave') {
        activateWave();
    } else if (type === 'resize') {
        gridWidth = payload.width;
        gridHeight = payload.height;
    }
};

