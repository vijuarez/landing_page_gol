import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to manage Game of Life state and worker communication
 * Now tracks cell ages for fade-in/fade-out effects
 */
export function useGameOfLife() {
    // Changed from Set to Map to store cell ages
    const [cellAges, setCellAges] = useState(new Map());
    const workerRef = useRef(null);
    const cellCountRef = useRef(0);

    // Initialize worker
    useEffect(() => {
        try {
            workerRef.current = new Worker(
                new URL('../workers/gameOfLife.worker.js', import.meta.url),
                { type: 'module' }
            );

            workerRef.current.onmessage = (e) => {
                // Worker now sends cellAges as array of [key, age] pairs
                const { cellAges: agesArray } = e.data;
                const newMap = new Map(agesArray);
                setCellAges(newMap);
                cellCountRef.current = newMap.size;
            };

            workerRef.current.onerror = (error) => {
                console.error('Game of Life Worker error:', error);
            };

            // Send initial grid dimensions (1.2x screen size for "endless" effect)
            const cellSize = 8;
            const scaleFactor = 1.5;
            workerRef.current.postMessage({
                type: 'init',
                width: Math.floor((window.innerWidth * scaleFactor) / cellSize),
                height: Math.floor((window.innerHeight * scaleFactor) / cellSize),
                maxAlive: 25000,
            });

            const handleResize = () => {
                if (workerRef.current) {
                    workerRef.current.postMessage({
                        type: 'resize',
                        width: Math.floor((window.innerWidth * scaleFactor) / cellSize),
                        height: Math.floor((window.innerHeight * scaleFactor) / cellSize),
                    });
                }
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (workerRef.current) {
                    workerRef.current.terminate();
                }
            };
        } catch (error) {
            console.error('Failed to initialize Game of Life worker:', error);
        }
    }, []);

    // Activate cells around a point
    const activate = useCallback((cellX, cellY, radius) => {
        if (workerRef.current) {
            workerRef.current.postMessage({
                type: 'activate',
                centerX: cellX,
                centerY: cellY,
                radius,
            });
        }
    }, []);

    // Trigger idle wave
    const triggerWave = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'wave' });
        }
    }, []);

    return { cellAges, activate, triggerWave, cellCount: cellCountRef.current };
}
