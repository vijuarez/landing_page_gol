import { useRef, useEffect } from 'react';
import { MAX_AGE } from '../workers/gameOfLife.worker';

// ============================================
// Rendering Constants (easily tunable)
// ============================================
const CELL_SIZE = 8; // pixels
const COLOR = { r: 255, g: 190, b: 50 }; // Warm amber/gold

// Opacity settings
const MIN_OPACITY = 0.2;     // Opacity at age 1 (50%)
const MAX_OPACITY = 1.0;     // Maximum opacity (100%)
const SIGMOID_CENTER = MAX_AGE / 2;   // Age at which opacity is ~75%
const SIGMOID_STEEPNESS = 0.3; // How quickly opacity changes (higher = steeper)

/**
 * Calculate opacity from cell age using sigmoid function
 * - Age 0: not displayed
 * - Age 1: MIN_OPACITY (50%)
 * - Age → ∞: approaches MAX_OPACITY (100%)
 * - At SIGMOID_CENTER: ~75% opacity
 */
function ageToOpacity(age) {
    if (age <= 0) return 0;
    if (age === 1) return MIN_OPACITY;

    // Sigmoid function: y = min + (max - min) / (1 + e^(-k*(x - center)))
    const sigmoid = 1 / (1 + Math.exp(-SIGMOID_STEEPNESS * (age - SIGMOID_CENTER)));
    return MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * sigmoid;
}

/**
 * Full-screen canvas rendering Game of Life cells via ImageData
 * Cells fade in/out based on their age using sigmoid-based opacity
 */
export function GameOfLifeCanvas({ cellAges }) {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const cellAgesRef = useRef(cellAges);

    // Keep ref in sync with prop
    useEffect(() => {
        cellAgesRef.current = cellAges;
    }, [cellAges]);

    // Setup canvas and render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false });

        // Set canvas size
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Render loop at 60 FPS using requestAnimationFrame
        const render = () => {
            const currentCellAges = cellAgesRef.current;
            const width = canvas.width;
            const height = canvas.height;

            // Clear with black
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Build ImageData
            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;

            // Draw cells with age-based opacity
            for (const [cellKey, age] of currentCellAges) {
                if (age <= 0) continue; // Skip dead cells

                const [x, y] = cellKey.split(',').map(Number);
                const px = x * CELL_SIZE;
                const py = y * CELL_SIZE;

                // Skip if cell is outside visible area
                if (px >= width || py >= height || px < 0 || py < 0) continue;

                // Calculate opacity from age
                const opacity = ageToOpacity(age);
                const alpha = Math.floor(opacity * 255);

                // Fill cellSize × cellSize block
                for (let dy = 0; dy < CELL_SIZE; dy++) {
                    for (let dx = 0; dx < CELL_SIZE; dx++) {
                        const pixelX = px + dx;
                        const pixelY = py + dy;

                        if (pixelX < width && pixelY < height) {
                            const idx = (pixelY * width + pixelX) * 4;
                            data[idx] = COLOR.r;
                            data[idx + 1] = COLOR.g;
                            data[idx + 2] = COLOR.b;
                            data[idx + 3] = alpha;
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                filter: 'blur(2px)',
            }}
            aria-hidden="true"
        />
    );
}
