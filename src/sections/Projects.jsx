import React, { useState } from 'react';
import { projects } from '../data/portfolioData';
import ProjectModal from '../components/ProjectModal';
import ShinyText from '../components/ShinyText';
import { useTheme } from '../hooks/useTheme';
import { FileText, ExternalLink } from 'lucide-react';

function formatDescription(text) {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--fg)', fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function Projects() {
  const { theme } = useTheme();
  const isDarkMode = theme !== 'light';
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenReport = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-heading-wrap">
        <h2>
          <ShinyText
            text="Projects"
            color={isDarkMode ? "#F5F1EC" : "#171717"}
            shineColor={isDarkMode ? "#FF8A4C" : "#FF6B35"}
            speed={2.2}
            delay={0.4}
            shineWidth={35}
            softness={0.85}
            bands={1}
            glow={0.08}
            trigger="loop"
            direction="left"
            easing="smooth"
          />
        </h2>
        <p className="lead">Featured applications and platforms built with clean architecture.</p>
      </div>
      
      <div className="grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card card-interactive"
            onClick={() => handleOpenReport(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenReport(project);
              }
            }}
          >
            <div className="card-content">
              <div className="card-title-row">
                <h3>{project.title}</h3>
              </div>
              <p>{formatDescription(project.description)}</p>

              <div className="card-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="card-action-btn card-report-btn"
                onClick={() => handleOpenReport(project)}
                aria-label={`View report for ${project.title}`}
              >
                <FileText size={14} className="card-btn-icon" aria-hidden="true" />
                <span>View Report</span>
              </button>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-action-btn card-project-btn"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} live project in new tab`}
              >
                <span>View Project</span>
                <ExternalLink size={14} className="card-btn-icon" aria-hidden="true" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={handleCloseModal}
      />
    </section>
  );
}
