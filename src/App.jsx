import { useEffect, useCallback } from 'react';
import { GameOfLifeCanvas } from './components/GameOfLifeCanvas';
import { MainContent } from './components/MainContent';
import { useGameOfLife } from './hooks/useGameOfLife';

const CELL_SIZE = 8;

/**
 * Root application component
 * Combines Game of Life canvas background with main content overlay
 * Captures mouse movement globally to activate cells
 */
function App() {
    const { cellAges, activate, triggerWave, gridWidth } = useGameOfLife();

    // Global mouse tracking - captures movement anywhere on the page
    const handleMouseMove = useCallback((e) => {
        const cellX = Math.floor(e.clientX / CELL_SIZE);
        const cellY = Math.floor(e.clientY / CELL_SIZE);
        activate(cellX, cellY);
    }, [activate]);

    useEffect(() => {
        // Handle touch events separately (for mobile drag)
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const cellX = Math.floor(touch.clientX / CELL_SIZE);
                const cellY = Math.floor(touch.clientY / CELL_SIZE);
                activate(cellX, cellY);
            }
        };

        // Attach to document for global capture
        document.addEventListener('pointermove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            document.removeEventListener('pointermove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, [handleMouseMove, activate]);

    return (
        <>
            <GameOfLifeCanvas cellAges={cellAges} gridWidth={gridWidth} />
            <MainContent triggerWave={triggerWave} />
        </>
    );
}

export default App;

