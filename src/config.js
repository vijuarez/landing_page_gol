/**
 * Application Configuration
 * 
 * This file contains all the configurable data and settings for the application.
 */

export const portfolioConfig = {
    projects: [
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
    ]
};

export const gameOfLifeConfig = {
    simulation: {
        ageGainRate: 15,    // Age increase per step when alive
        ageDecayRate: 8,    // Age decrease per step when dead
        initialAge: 1,      // Age for newly born cells
        maxAge: 80,         // Maximum age for cells
        maxAlive: 25000,    // Hard cap on alive cells to prevent performance issues
        tickRate: 50,       // Interval in ms (50ms = 20 FPS)
        initialSpawnCount: 500
    },
    interaction: {
        radius: 3,          // Eraser radius
        waveInterval: 2000  // Auto-wave interval in ms
    }
};

export const canvasConfig = {
    cellSize: 8, // pixels
    color: { r: 235, g: 170, b: 30 }, // Warm amber/gold
    opacity: {
        min: 0.1,     // Opacity at age 1 (10%)
        max: 1.0,     // Maximum opacity (100%)
        sigmoidSteepness: 0.1, // How quickly opacity changes
        sigmoidCenter: 40 // Center of sigmoid curve (usually maxAge / 2)
    }
};

export const siteConfig = {
    identity: {
        name: "Vicente Juárez",
        title: "Full Stack Developer"
    },
    links: {
        email: "mailto:vijuarez97@gmail.com",
        github: "https://github.com/vijuarez",
    },
    idleTimer: {
        timeout: 10000, // 10 seconds wait before auto-waves
        interval: 2000  // 2 seconds between auto-waves
    },
    about: {
        title: "About",
        content: `
Welcome to my interactive portfolio! This site is built with React and features a neat Game of Life simulation running on a background canvas. Move your mouse (or drag your finger) modify the simulation.


I made this as a recreation of [a previous homepage](https://github.com/vijuarez/vijuarez.github.io) I made with Flutter some years ago. It was a fun refresher for React and gave me the chance to play with some agentic workflows.


Feel free to explore my projects and CV!
        `
    },
};
