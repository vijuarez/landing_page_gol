import { useRef, useEffect } from 'react';

const CELL_SIZE = 8; // pixels
const COLOR = { r: 255, g: 190, b: 50 }; // Warm amber/gold

/**
 * Full-screen canvas rendering Game of Life cells via ImageData
 * Mouse tracking is handled at App root level
 */
export function GameOfLifeCanvas({ aliveCells }) {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const aliveCellsRef = useRef(aliveCells);

    // Keep ref in sync with prop
    useEffect(() => {
        aliveCellsRef.current = aliveCells;
    }, [aliveCells]);

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
            const currentCells = aliveCellsRef.current;
            const width = canvas.width;
            const height = canvas.height;

            // Clear with black
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Build ImageData
            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;

            // Draw cells
            for (const cellKey of currentCells) {
                const [x, y] = cellKey.split(',').map(Number);
                const px = x * CELL_SIZE;
                const py = y * CELL_SIZE;

                // Skip if cell is outside visible area
                if (px >= width || py >= height || px < 0 || py < 0) continue;

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
                            data[idx + 3] = 255;
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

