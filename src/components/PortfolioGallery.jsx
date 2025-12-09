import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import mdStyle from './md-style.module.css';

/**
 * Portfolio data structure - customize with your own projects
 * 
 * Image recommendations:
 * - thumbnail: 600×400px (3:2 aspect ratio) - shown in gallery
 * - screenshot: 1200×800px (3:2 aspect ratio) - shown in modal
 */
const portfolioData = [
    {
        id: 'ai-domain-assistant',
        title: 'AI-Powered Domain Assistant',
        shortDescription: 'A Gemini-powered guidance system for complex procedural queries, featuring a hybrid RAG system tuned for accuracy and source attribution. Deployed in production serving 2,000+ users.',
        extendedDescription: `
## Overview

A full-stack application that provides friendly access to internal databases, data visualizations, and an accurate AI assistant with built-in source attribution and complex domain-specific factoid retrieval. Built with **Flutter**, **Flask**, and a custom **hybrid RAG system** powered by Google's Gemini API.

## The Challenge

Integrating a large language model with specialized domain knowledge while minimizing hallucinations and maintaining user trust. The solution required three layers:

1. A **hybrid vector + keyword RAG system** to balance semantic understanding with precise phrase matching
2. **Rigorous evaluation and tuning** to meet accuracy thresholds before production
3. **Enforced source attribution** so users always knew where information originated

## Technical Implementation

- **Frontend:** Flutter application designed from the ground up following Material 3 design system, supporting web, mobile, and desktop deployment
- **Backend:** Flask microservice handling AI requests, integrating via JWT authentication with the existing platform API
- **RAG System:** Custom search weight tuning (keyword vs. vector similarity) against a curated evaluation dataset, validated by domain experts before launch
- **Integration:** Coordinated API contracts between the RAG system, the Flask backend, and the frontend team

## Scale & Reliability

- **2,000+ active users** in production across all platforms
- Maintained high accuracy thresholds while serving real domain-specific queries
- Iterative tuning process reduced hallucinations and improved response quality measurably
        `,
        thumbnail: '/images/ai-assistant-thumb.jpg',
        screenshot: '/images/ai-assistant-full.jpg',
    },
    {
        id: 'housing-subsidies-platform',
        title: 'Housing Subsidies Platform',
        shortDescription: 'A high-traffic web platform serving 8,000+ monthly users, combining Ruby on Rails backend, Angular frontend, and complex domain logic for government housing benefit administration.',
        extendedDescription: `
## Overview

A full-stack platform designed to improve awareness and accessibility of government housing subsidies. The application handles **8,000+ monthly users** with strict security requirements, complex feature-rich workflows, and integration with external systems.

**Tech Stack:** Ruby on Rails, Angular, PostgreSQL, Google Cloud Platform

## Technical Architecture

### Security & Access Control
- **Field-level encryption** for sensitive user data
- **Role-based access controls (RBAC)** ensuring users only access authorized information

### Core Features
- **Complex internal interface** for content creation and process administration
- **Node-based visual editor** for designing complex email campaign workflows
- **WYSIWYG editor** for managing multiple custom content types
- **Advanced analytics** via Rudderstack and New Relic for behavioral insights

## Scale & Infrastructure

- **High-traffic design** built to reliably handle 8,000+ monthly users and traffic spikes
- **Cloud migration leadership:** Transitioned infrastructure from a single VPS to **Google Cloud Platform**
  - Deployed on **Cloud Run** with autoscaling
  - **Cloud SQL** for database management
  - **Cloud Storage** for user-facing assets
  - Cost optimization: maintained budget targets while handling peak concurrent load
- **Data pipeline:** Migrated analytics from Airflow/dbt to **BigQuery**, enabling the research team to derive insights without impacting web service performance

## Impact

The platform meaningfully improved how residents discover and access housing benefits, removing technical and informational barriers to accessing government support. The flexible content system allowed researchers to quickly iterate on content ideas and campaign behavior, cutting down latency between theory and practice.
        `,
        thumbnail: '/images/housing-platform-thumb.jpg',
        screenshot: '/images/housing-platform-full.jpg',
    },
];

/**
 * Hook to detect mobile viewport
 */
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
}

/**
 * Portfolio gallery with modal detail view
 */
export function PortfolioGallery() {
    const [selectedProject, setSelectedProject] = useState(null);
    const isMobile = useIsMobile();

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
        <div style={containerStyle(isMobile)}>
            {/* Project Cards */}
            <div style={gridStyle(isMobile)}>
                {portfolioData.map((project) => (
                    <div
                        key={project.id}
                        style={projectCardStyle(isMobile)}
                        onClick={() => setSelectedProject(project)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
                    >
                        <div style={thumbnailContainerStyle}>
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                style={imageStyle}
                                loading="lazy"
                            />
                        </div>
                        <div style={projectInfoStyle}>
                            <h3 style={projectTitleStyle}>{project.title}</h3>
                            <p style={projectDescStyle}>{project.shortDescription}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay - Rendered via portal to bypass translateX */}
            {selectedProject && createPortal(
                <div style={modalOverlayStyle(isMobile)} onClick={() => setSelectedProject(null)}>
                    <div style={modalContentStyle(isMobile)} onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button
                            style={closeButtonStyle}
                            onClick={() => setSelectedProject(null)}
                            aria-label="Close modal"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {/* Modal Inner Layout - Responsive */}
                        <div style={modalInnerStyle(isMobile)}>
                            {/* Screenshot Section */}
                            <div style={screenshotContainerStyle(isMobile)}>
                                <img
                                    src={selectedProject.screenshot}
                                    alt={`${selectedProject.title} screenshot`}
                                    style={screenshotImageStyle}
                                />
                            </div>

                            {/* Description Section */}
                            <div style={descriptionContainerStyle(isMobile)}>
                                <h2 style={modalTitleStyle}>{selectedProject.title}</h2>
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

// ============================================
// Gallery Styles
// ============================================

const containerStyle = (isMobile) => ({
    padding: isMobile ? '0' : '20px',
    height: '100%',
    overflowY: 'auto',
});

const gridStyle = (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2em',
    maxWidth: isMobile ? '100%' : '1200px',
    margin: '0 auto',
});

const projectCardStyle = (isMobile) => ({
    backgroundColor: 'rgba(255, 200, 50, 0.05)',
    borderRadius: isMobile ? '12px' : '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 200, 50, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
});

const thumbnailContainerStyle = {
    width: '100%',
    aspectRatio: '3 / 2',
    overflow: 'hidden',
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
};

const projectInfoStyle = {
    padding: '20px',
    backdropFilter: 'blur(10px)',
    background: 'rgba(0, 0, 0, 0.6)',
    height: '100%',
    overflowY: 'scroll',
};

const projectTitleStyle = {
    fontSize: '1.3em',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#FFD700',
};

const projectDescStyle = {
    fontSize: '0.95em',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.5',
    margin: 0,
};

// ============================================
// Modal Styles (Responsive)
// ============================================

const modalOverlayStyle = (isMobile) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: isMobile ? 'stretch' : 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: isMobile ? '0' : '20px',
    pointerEvents: 'auto',
});

const modalContentStyle = (isMobile) => ({
    position: 'relative',
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: isMobile ? '0' : '20px',
    border: isMobile ? 'none' : '1px solid rgba(255, 200, 50, 0.3)',
    maxWidth: isMobile ? '100%' : '1100px',
    maxHeight: isMobile ? '100%' : '90vh',
    width: '100%',
    height: isMobile ? '100%' : 'auto',
    overflow: 'hidden',
    boxShadow: isMobile ? 'none' : '0 25px 50px rgba(0, 0, 0, 0.5)',
});

const closeButtonStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'rgba(255, 200, 50, 0.1)',
    border: '1px solid rgba(255, 200, 50, 0.3)',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#FFD700',
    transition: 'all 0.2s ease',
    zIndex: 10,
    pointerEvents: 'auto',
};

const modalInnerStyle = (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: '100%',
    maxHeight: isMobile ? '100%' : '90vh',
    overflowY: isMobile ? 'auto' : 'hidden',
});

const screenshotContainerStyle = (isMobile) => ({
    flex: isMobile ? '0 0 auto' : '1 1 55%',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '60px 20px 20px' : '24px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
});

const screenshotImageStyle = {
    width: '100%',
    height: 'auto',
    maxHeight: '70vh',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '4px',
};

const descriptionContainerStyle = (isMobile) => ({
    flex: isMobile ? '1 1 auto' : '1 1 45%',
    padding: isMobile ? '24px 20px 32px' : '40px 32px',
    overflowY: isMobile ? 'visible' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
});

const modalTitleStyle = {
    fontSize: 'clamp(1.5em, 3vw, 2em)',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#FFD700',
    lineHeight: '1.2',
};
