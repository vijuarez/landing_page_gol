import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import mdStyle from './md-style.module.css';

import { portfolioConfig } from '../config';

import styles from './PortfolioGallery.module.css';

/**
 * Portfolio gallery with modal detail view
 */
export function PortfolioGallery() {
    const [selectedProject, setSelectedProject] = useState(null);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setSelectedProject(null);
        };
        if (selectedProject) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [selectedProject]);

    return (
        <div className={styles.container}>
            {/* Project Cards */}
            <div className={styles.grid}>
                {portfolioConfig.projects.map((project) => (
                    <div
                        key={project.id}
                        className={styles.projectCard}
                        onClick={() => setSelectedProject(project)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
                    >
                        <div className={styles.thumbnailContainer}>
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                className={styles.image}
                                loading="lazy"
                            />
                        </div>
                        <div className={styles.projectInfo}>
                            <h3 className={styles.projectTitle}>{project.title}</h3>
                            <p className={styles.projectDesc}>{project.shortDescription}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay - Rendered via portal to bypass translateX */}
            {selectedProject && createPortal(
                <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelectedProject(null)}
                            aria-label="Close modal"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {/* Modal Inner Layout - Responsive */}
                        <div className={styles.modalInner}>
                            {/* Screenshot Section */}
                            <div className={styles.screenshotContainer}>
                                <img
                                    src={selectedProject.screenshot}
                                    alt={`${selectedProject.title} screenshot`}
                                    className={styles.screenshotImage}
                                />
                            </div>

                            {/* Description Section */}
                            <div className={styles.descriptionContainer}>
                                <h2 className={styles.modalTitle}>{selectedProject.title}</h2>
                                <div className={mdStyle.reactMarkdown}>
                                    <ReactMarkdown>{selectedProject.extendedDescription}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}


