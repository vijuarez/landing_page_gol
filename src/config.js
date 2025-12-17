/**
 * Application Configuration
 * 
 * This file contains all the configurable data and settings for the application.
 */


/**
 * Portfolio data structure, add your own projects!
 *
 * Image recommendations:
 * - thumbnail: 600×400px (3:2 aspect ratio) - shown in gallery
 * - screenshot: 1200×800px (3:2 aspect ratio) - shown in modal
 */
export const portfolioConfig = {
    projects: [
        {
            id: 'ai-domain-assistant',
            title: 'AI-Powered Domain Assistant',
            shortDescription: 'A Gemini-powered guidance system for complex procedural queries, featuring a hybrid RAG system tuned for accuracy and source attribution.',
            extendedDescription: `
## Overview

Full-stack development of an application that provides data visualization and an accurate AI assistant with built-in source attribution and complex domain-specific factoid retrieval.

**Tech Stack:** Flutter, Flask and Google Cloud Platform.

## The Challenge

Integrating a large language model with specialized domain knowledge while minimizing hallucinations and maintaining user trust. The solution required three layers:

1. A **hybrid vector + keyword RAG system** to balance semantic understanding with precise phrase matching
2. **Rigorous evaluation and tuning** to meet accuracy thresholds before production
3. **Enforced source attribution** so users always knew where information originated

## Technical Implementation

- **Frontend:** Flutter application designed from the ground up following the Material 3 design system
- **Backend:** Flask microservice handling AI requests, integrating via JWT and shared secrets with the existing platform API
- **RAG System:** Custom search weight tuning (keyword vs. vector similarity) against a curated evaluation dataset, validated by domain experts before launch

## Scale & Impact

- Maintained high accuracy thresholds while serving real domain-specific queries
- Iterative tuning process reduced hallucinations and improved response quality measurably
            `,
            thumbnail: '/images/ai-assistant-thumb.jpg',
            screenshot: '/images/ai-assistant-full.jpg',
        },
        {
            id: 'housing-subsidies-platform',
            title: 'Housing Subsidies Platform',
            shortDescription: 'A high-traffic web platform serving 20,000+ seasonal users, combining Ruby on Rails backend, Angular frontend, and complex domain logic for government housing benefit communication.',
            extendedDescription: `
## Overview

Led backend development on a platform designed to improve awareness and accessibility of government housing subsidies. The application handles **20,000+ seasonal users** with strict security requirements, complex feature-rich workflows, and integration with external systems. Later inherited and expanded the Angular frontend, adding features and maintaining the full stack through production.

**Tech Stack:** Ruby on Rails, Angular, PostgreSQL, Google Cloud Platform

## The Challenge

Building a secure, feature-rich system that could reliably handle high traffic while maintaining complex internal workflows and strict access controls over sensitive user data.

## Technical Implementation

### Security & Access Control
- **Field-level encryption** for sensitive user data
- **Role-based access controls (RBAC)** ensuring users only access authorized information

### Core Features
- **Complex internal interface** for content creation and process administration
- **Node-based visual editor** for designing complex email campaign workflows
- **WYSIWYG editor** for managing multiple custom content types
- **Advanced analytics** via Rudderstack for behavioral insights

## Scale & Impact

- **High-traffic design** built to reliably handle 20,000+ monthly users and traffic spikes
- **Cloud migration leadership:** Transitioned infrastructure from VPS to **Google Cloud Platform**
  - Deployed on **Cloud Run** with autoscaling
  - **Cloud SQL** for database management
  - **Cloud Storage** for user-facing assets
  - Cost optimization: maintained budget targets while handling peak concurrent load
- **Data pipeline:** Migrated analytics from Airflow/dbt to **BigQuery**, enabling the research team to derive insights without impacting web service performance
- **Impact:** The platform meaningfully improved how residents discover and access housing benefits, removing technical and informational barriers to accessing government support. The flexible content system allowed researchers to quickly iterate on content ideas and campaign behavior, cutting down latency between theory and practice.
            `,
            thumbnail: '/images/housing-platform-thumb.jpg',
            screenshot: '/images/housing-platform-full.jpg',
        },
    ]
};

/**
 * Game of Life simulation configuration
 *
 * Caution! `simulation.tickRate` and `simulation.maxAlive` impact performance.
 */
export const gameOfLifeConfig = {
    // Configuration on how the Game of Life simulation works
    simulation: {
        // Age increase per step when alive
        ageGainRate: 15,
        // Age decrease per step when dead
        ageDecayRate: 8,
        // Age for newly born cells
        initialAge: 1,
        // Maximum age for cells
        maxAge: 80,
        // Hard cap on alive cells to prevent performance issues
        maxAlive: 25000,
        // Interval in ms (50ms = 20 FPS)
        tickRate: 50,
        // Number of random cells at the start of the simulation
        initialSpawnCount: 500
    },
    // Configuration on how the interaction with the Game of Life simulation works
    interaction: {
        // Eraser radius
        radius: 3,
        // Time of inactivity before spawn wave
        waveTimeout: 10000,
        // Time between waves when inactive timeout hits
        waveInterval: 2000
    }
};

/**
 * Game of Life canvas configuration
 *
 * While `gameOfLifeConfig` has the key performance configurations, `cellSize` and `scaleFactor`
 * have a massive impact in performance, since simulation size is canvas dependent.
 */
export const canvasConfig = {
    // Pixel size for Game of Life canvas
    cellSize: 8,
    // Factor for the extra space of the simulation outside canvas
    scaleFactor: 1.2,
    // Alive cells color
    color: '#ebaa1e',
    // Background color
    backgroundColor: '#000000',
    // Configuration for the opacity/age looks
    opacity: {
        // Opacity at age 1 (10%)
        min: 0.1,
        // Maximum opacity (100%)
        max: 1.0,
        // How quickly opacity changes
        sigmoidSteepness: 0.1,
        // Center of sigmoid curve (usually maxAge / 2)
        sigmoidCenter: 40
    }
};

/**
 * Static strings for the site.
 */
export const siteConfig = {
    // Main title
    identity: {
        name: "Vicente Juárez",
        title: "Full Stack Developer"
    },
    // Bottom links configuration
    links: {
        email: "mailto:vijuarez97@gmail.com",
        github: "https://github.com/vijuarez",
    },
    // "About" modal configuration
    about: {
        title: "About",
        content: `
Welcome to my interactive portfolio! This site is built with React and features a neat Game of Life simulation running on a background canvas. Move your mouse (or drag your finger) modify the simulation.


I made this as a recreation of [a previous homepage](https://github.com/vijuarez/vijuarez.github.io) I made with Flutter some years ago. It was a fun refresher for React and gave me the chance to play with some agentic workflows.


Feel free to explore my projects and CV!
        `
    },
};
