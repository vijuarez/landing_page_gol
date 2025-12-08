import { useState, useRef, useEffect, useCallback } from 'react';
import { PortfolioGallery } from './PortfolioGallery';

/**
 * Main content component with full-page slide transitions.
 * Contains three full-viewport pages: MainContent (welcome), CV, and Portfolio.
 * The entire viewport slides horizontally between pages.
 */
export function MainContent({ triggerWave }) {
    const [currentPage, setCurrentPage] = useState('welcome');
    const idleTimerRef = useRef(null);

    // Idle detection - trigger wave after 10 seconds of no activity
    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            clearInterval(idleTimerRef.current);
        }
        idleTimerRef.current = setTimeout(() => {
            if (triggerWave) {
                triggerWave();
                idleTimerRef.current = setInterval(() => {
                    triggerWave();
                }, 2000);
            }
        }, 10000);
    }, [triggerWave]);

    useEffect(() => {
        const handleActivity = () => resetIdleTimer();
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        resetIdleTimer();

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
                clearInterval(idleTimerRef.current);
            }
        };
    }, [resetIdleTimer]);

    // Calculate slide offset: CV left, Welcome center, Portfolio right
    // The slider has 3 pages each 100vw wide, total 300vw
    // To show Welcome (center page), we need translateX(-100vw)
    // To show CV (first page), we need translateX(0)
    // To show Portfolio (last page), we need translateX(-200vw)
    const getOffset = () => {
        if (currentPage === 'cv') return '0';
        if (currentPage === 'portfolio') return '-200vw';
        return '-100vw'; // welcome (default)
    };

    const goBack = () => setCurrentPage('welcome');

    return (
        <div style={viewportStyle}>
            <div style={sliderStyle(getOffset())}>
                {/* CV Page (Left of Welcome) */}
                <div style={pageStyle}>
                    <CVPage onBack={goBack} />
                </div>

                {/* Welcome Page (Center) */}
                <div style={pageStyle}>
                    <WelcomePage
                        onNavigateCV={() => setCurrentPage('cv')}
                        onNavigatePortfolio={() => setCurrentPage('portfolio')}
                    />
                </div>

                {/* Portfolio Page (Right of Welcome) */}
                <div style={pageStyle}>
                    <PortfolioPage onBack={goBack} />
                </div>
            </div>
        </div>
    );
}

/**
 * Welcome page with header, navigation buttons, and footer
 */
function WelcomePage({ onNavigateCV, onNavigatePortfolio }) {
    return (
        <div style={welcomeContainerStyle}>
            {/* Header - Fixed at top */}
            <header style={headerStyle}>
                <h1 style={titleStyle}>Vicente Juárez</h1>
                <p style={subtitleStyle}>Full Stack Developer</p>
            </header>

            {/* Main Navigation Buttons - Centered */}
            <nav style={navStyle}>
                <button onClick={onNavigateCV} style={primaryButtonStyle}>
                    <svg style={arrowIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Curriculum Vitae
                </button>
                <button onClick={onNavigatePortfolio} style={primaryButtonStyle}>
                    Portfolio
                    <svg style={arrowIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </nav>

            {/* Footer Links */}
            <footer style={footerStyle}>
                <a href="mailto:vijuarez97@gmail.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    Email
                </a>
                <span style={dividerStyle}>•</span>
                <a href="https://github.com/vijuarez" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    GitHub
                </a>
            </footer>
        </div>
    );
}

/**
 * CV Page with PDF viewer and back button
 * Uses state to check if PDF exists before rendering embed
 */
function CVPage({ onBack }) {
    const [pdfExists, setPdfExists] = useState(null); // null = loading, true = exists, false = missing

    useEffect(() => {
        // Check if PDF file exists
        fetch('/cv.pdf', { method: 'HEAD' })
            .then(response => {
                // Check if response is actually a PDF (not HTML fallback)
                const contentType = response.headers.get('content-type');
                setPdfExists(response.ok && contentType && contentType.includes('pdf'));
            })
            .catch(() => setPdfExists(false));
    }, []);

    return (
        <div style={subpageContainerStyle}>
            <button onClick={onBack} style={backButtonRightStyle}>
                Back to Home →
            </button>
            <h1 style={pageTitleStyle}>Curriculum Vitae</h1>
            <div style={cvContentStyle}>
                {pdfExists !== true && (
                    <div style={fallbackStyle}>
                        <p>Loading CV...</p>
                    </div>
                )}
                {pdfExists === true && (
                    <iframe
                        src="/cv.pdf"
                        title="CV PDF Document"
                        style={pdfStyle}
                    />
                )}
            </div>
        </div>
    );
}

/**
 * Portfolio Page with gallery and back button
 */
function PortfolioPage({ onBack }) {
    return (
        <div style={subpageContainerStyle}>
            <button onClick={onBack} style={backButtonStyle}>
                ← Back to Home
            </button>
            <h1 style={pageTitleStyle}>Portfolio</h1>
            <div style={portfolioContentStyle}>
                <PortfolioGallery />
            </div>
        </div>
    );
}

// ============================================
// Layout Styles
// ============================================

const viewportStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 1,
    pointerEvents: 'none', // Allow mouse events to pass through to canvas
};

// SVG arrow icon style for navigation buttons
const arrowIconStyle = {
    width: '20px',
    height: '20px',
    flexShrink: 0,
};

const sliderStyle = (offset) => ({
    display: 'flex',
    width: '300vw',
    height: '100%',
    transform: `translateX(${offset})`,
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
});

const pageStyle = {
    width: '100vw',
    height: '100%',
    flexShrink: 0,
};

// ============================================
// Welcome Page Styles
// ============================================

const welcomeContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '60px 20px 40px',
    color: '#ffffff',
};

const headerStyle = {
    textAlign: 'center',
};

const titleStyle = {
    fontSize: 'clamp(2.5em, 6vw, 4em)',
    margin: '0 0 16px 0',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 0%, #FFD700 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
};

const subtitleStyle = {
    fontSize: 'clamp(1em, 2.5vw, 1.4em)',
    margin: 0,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
    letterSpacing: '3px',
    textTransform: 'uppercase',
};

const navStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flex: 1,
    justifyContent: 'center',
    maxWidth: '300px',
    width: '100%',
};

const primaryButtonStyle = {
    padding: '20px 50px',
    fontSize: '1.1em',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 200, 50, 0.1)',
    border: '2px solid #FFD700',
    color: '#FFD700',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '1px',
    backdropFilter: 'blur(10px)',
    pointerEvents: 'auto', // Re-enable pointer events for buttons
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px', // Space between icon and text
};

const footerStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
};

const linkStyle = {
    color: '#FFD700',
    textDecoration: 'none',
    fontSize: '1.1em',
    width: '8em',
    textAlign: 'center',
    transition: 'color 0.2s ease',
    pointerEvents: 'auto', // Re-enable pointer events for links
};

const dividerStyle = {
    color: 'rgba(255, 200, 50, 0.4)',
};

// ============================================
// Subpage Styles (CV & Portfolio)
// ============================================

const subpageContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 40px',
    color: '#ffffff',
};

const backButtonStyle = {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#FFD700',
    border: '1px solid rgba(255, 200, 50, 0.5)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: '20px',
    transition: 'all 0.2s ease',
    pointerEvents: 'auto', // Re-enable pointer events for back button
};

// Back button aligned to the right for CV page (comes from left)
const backButtonRightStyle = {
    ...backButtonStyle,
    alignSelf: 'flex-end',
};

const pageTitleStyle = {
    fontSize: 'clamp(1.8em, 4vw, 2.5em)',
    fontWeight: '600',
    marginBottom: '25px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #ffffff 0%, #FFD700 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
};

const cvContentStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 200, 50, 0.2)',
    overflow: 'hidden',
    minHeight: 0,
    pointerEvents: 'auto', // Re-enable pointer events for content
};

const pdfStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
};

const fallbackStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '20px',
    color: 'rgba(255, 255, 255, 0.7)',
};

const downloadLinkStyle = {
    padding: '14px 30px',
    backgroundColor: '#FFD700',
    color: '#000000',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    pointerEvents: 'auto',
};

const portfolioContentStyle = {
    flex: 1,
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 200, 50, 0.2)',
    minHeight: 0,
    pointerEvents: 'auto', // Re-enable pointer events for portfolio content
};
