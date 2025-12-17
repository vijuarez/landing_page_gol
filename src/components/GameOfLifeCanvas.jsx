import { useRef, useEffect } from 'react';
import { decodeCell } from '../workers/gameOfLife.worker';
import { canvasConfig } from '../config';

// ============================================
// Rendering Constants (easily tunable)
// ============================================
// Configured in src/config.js

/**
 * Calculate opacity from cell age using sigmoid function
 * - Age 0: not displayed
 * - Age 1: MIN_OPACITY
 * - Age → ∞: approaches MAX_OPACITY
 */
function ageToOpacity(age) {
    if (age <= 0) return 0;
    if (age === 1) return canvasConfig.opacity.min;

    // Sigmoid function: y = min + (max - min) / (1 + e^(-k*(x - center)))
    // Targeting pleasing look: very faint young cells, bright old cells, little in-between
    const sigmoid = 1 / (1 + Math.exp(-canvasConfig.opacity.sigmoidSteepness * (age - canvasConfig.opacity.sigmoidCenter)));
    return canvasConfig.opacity.min + (canvasConfig.opacity.max - canvasConfig.opacity.min) * sigmoid;
}

/**
 * Full-screen canvas rendering of Game of Life cells
 * Cells fade in/out based on their age using sigmoid-based opacity
 */
export function GameOfLifeCanvas({ cellAges, gridWidth }) {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const cellAgesRef = useRef(cellAges);
    const gridWidthRef = useRef(gridWidth);

    // Keep refs in sync with props
    useEffect(() => {
        cellAgesRef.current = cellAges;
    }, [cellAges]);

    useEffect(() => {
        gridWidthRef.current = gridWidth;
    }, [gridWidth]);

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

            const cellsByColor = new Map();
            for (const [cellKey, age] of currentCellAges) {
                if (age <= 0) continue;
                const [x, y] = decodeCell(cellKey, gridWidthRef.current);
                const px = x * canvasConfig.cellSize;
                const py = y * canvasConfig.cellSize;
                if (px >= width || py >= height || px < 0 || py < 0) continue;

                const opacity = ageToOpacity(age);
                const r = Math.floor(canvasConfig.color.r * opacity);
                const g = Math.floor(canvasConfig.color.g * opacity);
                const b = Math.floor(canvasConfig.color.b * opacity);

                const colorKey = r | (g << 8) | (b << 16);
                if (!cellsByColor.has(colorKey)) cellsByColor.set(colorKey, []);
                cellsByColor.get(colorKey).push({ px, py });
            }

            for (const [color, cells] of cellsByColor) {
                // Testing showed better performance by batching style changes and only interpolating the string once
                // I'd like to test this against more varied targets in the future, my numbers weren't conclusive
                ctx.fillStyle = `rgb(${color & 255},${(color >>> 8) & 255},${(color >>> 16) & 255})`;
                for (const { px, py } of cells) {
                    ctx.fillRect(px, py, canvasConfig.cellSize, canvasConfig.cellSize);
                }
            }

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
