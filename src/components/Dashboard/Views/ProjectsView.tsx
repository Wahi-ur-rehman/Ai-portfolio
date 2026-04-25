import React from 'react';
import { portfolioData } from '../../../data/portfolioData';

const ProjectsView: React.FC = () => {
  return (
    <div className="view-container">
      <h1 className="view-title">System Implementations</h1>
      
      <div className="projects-grid">
        {portfolioData.projects.map((project, i) => (
          <div key={project.id} className={`project-card depth-hover stagger-item stagger-${(i % 4) + 1}`}>
            <div className="project-image-container">
              <img src={project.imageSrc} alt={project.imageAlt} className="project-image" />
              <div className="project-overlay">
                <div className="project-links">
                  {project.links.github !== "#" && (
                    <a href={project.links.github} target="_blank" rel="noreferrer" className="action-btn magnetic">Code</a>
                  )}
                  {project.links.demo !== "#" && (
                    <a href={project.links.demo} target="_blank" rel="noreferrer" className="action-btn primary magnetic">Demo</a>
                  )}
                  {project.links.video !== "#" && (
                    <a href={project.links.video} target="_blank" rel="noreferrer" className="action-btn primary magnetic">Proof</a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc" style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>{project.description}</p>
              
              <div className="project-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tag magnetic" style={{ display: 'inline-block' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;
