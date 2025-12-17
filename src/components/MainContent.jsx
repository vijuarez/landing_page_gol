import { siteConfig } from '../config';
import { useState, useRef, useEffect, useCallback } from 'react';
import { PortfolioGallery } from './PortfolioGallery';
import ReactMarkdown from "react-markdown";
import styles from './MainContent.module.css';

/**
 * Main content component with full-page slide transitions.
 * Contains three full-viewport pages: MainContent (welcome), CV, and Portfolio.
 * The entire viewport slides horizontally between pages.
 */
export function MainContent({ triggerWave }) {
    const [currentPage, setCurrentPage] = useState('welcome');
    const idleTimerRef = useRef(null);

    // Idle detection - trigger wave after configured time of no activity
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
                }, siteConfig.idleTimer.interval);
            }
        }, siteConfig.idleTimer.timeout);
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
        <div className={styles.viewport}>
            <div style={sliderStyle(getOffset())}>
                {/* CV Page (Left of Welcome) */}
                <div className={styles.page}>
                    <CVPage onBack={goBack} />
                </div>

                {/* Welcome Page (Center) */}
                <div className={styles.page}>
                    <WelcomePage
                        onNavigateCV={() => setCurrentPage('cv')}
                        onNavigatePortfolio={() => setCurrentPage('portfolio')}
                    />
                </div>

                {/* Portfolio Page (Right of Welcome) */}
                <div className={styles.page}>
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
    const [showAboutModal, setShowAboutModal] = useState(false);
    return (
        <div className={styles.welcomeContainer}>
            {/* Header - Fixed at top */}
            <header className={styles.header}>
                <h1 className={styles.title}>{siteConfig.identity.name}</h1>
                <p className={styles.subtitle}>{siteConfig.identity.title}</p>
            </header>

            {/* Main Navigation Buttons - Centered */}
            <nav className={styles.nav}>
                <button onClick={onNavigateCV} className={styles.primaryButton}>
                    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Curriculum Vitae
                </button>
                <button onClick={onNavigatePortfolio} className={styles.primaryButton}>
                    Portfolio
                    <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </nav>

            {/* Footer Links */}
            <footer className={styles.footer}>
                <a href={siteConfig.links.email} target="_blank" rel="noopener noreferrer">
                    Email
                </a>
                <span className={styles.divider}>•</span>
                <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <span className={styles.divider}>•</span>
                <a href="#" onClick={(e) => { e.preventDefault(); setShowAboutModal(true); }}>
                    About
                </a>
            </footer>

            {/* About Modal */}
            {showAboutModal && (
                <div className={styles.aboutModalOverlay} onClick={() => setShowAboutModal(false)}>
                    <div className={styles.aboutModalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.aboutCloseButton} onClick={() => setShowAboutModal(false)}>×</button>
                        <h2 className={styles.aboutTitle}>{siteConfig.about.title}</h2>
                        <div className={styles.markdown}>
                            <ReactMarkdown>{siteConfig.about.content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
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
        <div className={styles.subpageContainer}>
            <button onClick={onBack} className={styles.backButtonRight}>
                Back to Home →
            </button>
            <h1 className={styles.pageTitle}>Curriculum Vitae</h1>
            <div className={styles.cvContent}>
                {pdfExists !== true && (
                    <div className={styles.fallback}>
                        <p>Loading CV...</p>
                    </div>
                )}
                {pdfExists === true && (
                    <iframe
                        src="/cv.pdf"
                        title="CV PDF Document"
                        className={styles.pdf}
                    />
                )}
            </div>
        </div>
    );
}

/**
 * Portfolio Page with gallery and back button
 */
/**
 * Portfolio Page with gallery and back button
 */
function PortfolioPage({ onBack }) {
    return (
        <div className={styles.subpageContainer}>
            <button onClick={onBack} className={styles.backButton}>
                ← Back to Home
            </button>
            <h1 className={styles.pageTitle}>Portfolio</h1>
            <div className={styles.portfolioContent}>
                <PortfolioGallery />
            </div>
        </div>
    );
}

// ============================================
// Layout Styles
// ============================================

// ============================================
// Layout Styles
// ============================================

const sliderStyle = (offset) => ({
    display: 'flex',
    width: '300vw',
    height: '100%',
    transform: `translateX(${offset})`,
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
});

