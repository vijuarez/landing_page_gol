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
    const { aliveCells, activate, triggerWave } = useGameOfLife();

    // Global mouse tracking - captures movement anywhere on the page
    const handleMouseMove = useCallback((e) => {
        const cellX = Math.floor(e.clientX / CELL_SIZE);
        const cellY = Math.floor(e.clientY / CELL_SIZE);
        activate(cellX, cellY, 5);
    }, [activate]);

    useEffect(() => {
        // Attach to document for global capture
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove]);

    return (
        <>
            <GameOfLifeCanvas aliveCells={aliveCells} />
            <MainContent triggerWave={triggerWave} />
        </>
    );
}

export default App;

