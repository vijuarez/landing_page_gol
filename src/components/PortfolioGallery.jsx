import { useState } from 'react';

/**
 * Portfolio data structure - customize with your own projects
 */
const portfolioData = [
    {
        id: 'web-app',
        title: 'Web Application',
        category: 'Web',
        description: 'Full-stack web application with modern UI',
        images: ['/images/project1-1.jpg', '/images/project1-2.jpg'],
    },
    {
        id: 'design-system',
        title: 'Design System',
        category: 'Design',
        description: 'Component library and design tokens',
        images: ['/images/project2-1.jpg'],
    },
    {
        id: 'mobile-app',
        title: 'Mobile App',
        category: 'Mobile',
        description: 'Cross-platform mobile application',
        images: ['/images/project3-1.jpg'],
    },
    {
        id: 'api-project',
        title: 'REST API',
        category: 'Backend',
        description: 'Scalable REST API architecture',
        images: ['/images/project4-1.jpg'],
    },
];

/**
 * Portfolio gallery with category filtering and responsive grid
 */
export function PortfolioGallery() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(portfolioData.map((p) => p.category))];

    const filtered =
        selectedCategory === 'All'
            ? portfolioData
            : portfolioData.filter((p) => p.category === selectedCategory);

    return (
        <div style={containerStyle}>
            {/* Category Filter */}
            <div style={filterContainerStyle}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={categoryButtonStyle(selectedCategory === cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            <div style={gridStyle}>
                {filtered.map((project) => (
                    <div key={project.id} style={projectCardStyle}>
                        <div style={imageContainerStyle}>
                            <div style={placeholderImageStyle}>
                                <span style={placeholderTextStyle}>{project.title}</span>
                            </div>
                        </div>
                        <div style={projectInfoStyle}>
                            <h3 style={projectTitleStyle}>{project.title}</h3>
                            <p style={projectDescStyle}>{project.description}</p>
                            <span style={categoryTagStyle}>{project.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Styles
const containerStyle = {
    padding: '20px',
    height: '100%',
    overflowY: 'auto',
};

const filterContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    flexWrap: 'wrap',
    justifyContent: 'center',
};

const categoryButtonStyle = (isActive) => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#FFD700' : 'rgba(255, 200, 50, 0.1)',
    color: isActive ? '#000' : '#FFD700',
    border: '1px solid #FFD700',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85em',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
});

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
};

const projectCardStyle = {
    backgroundColor: 'rgba(255, 200, 50, 0.05)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 200, 50, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
};

const imageContainerStyle = {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
};

const placeholderImageStyle = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255, 200, 50, 0.2) 0%, rgba(200, 150, 25, 0.3) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const placeholderTextStyle = {
    color: 'rgba(255, 200, 50, 0.6)',
    fontSize: '1.1em',
    fontWeight: '500',
};

const projectInfoStyle = {
    padding: '16px',
    backdropFilter: 'blur(10px)',
    background: 'rgba(0, 0, 0, 0.6)',
};

const projectTitleStyle = {
    fontSize: '1.1em',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#ffffff',
};

const projectDescStyle = {
    fontSize: '0.85em',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '12px',
    lineHeight: '1.4',
};

const categoryTagStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: 'rgba(255, 200, 50, 0.15)',
    color: '#FFD700',
    borderRadius: '12px',
    fontSize: '0.75em',
    fontWeight: '500',
};
