import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../../../data/portfolioData';
import ProjectModal from '../ProjectModal';

const ProjectsView: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <div className="view-container">
      <h1 className="view-title">System Implementations</h1>
      
      <div className="projects-grid">
        {portfolioData.projects.map((project, i) => (
          <motion.div 
            key={project.id} 
            className="project-card depth-hover"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            layoutId={project.id}
          >
            <div className="project-image-container">
              <img src={project.imageSrc} alt={project.imageAlt} className="project-image" />
              <div className="project-overlay">
                <div className="project-links">
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="action-btn primary magnetic"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            <div className="project-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 className="project-title">{project.title}</h3>
                <div style={{ fontSize: '1rem', color: 'var(--accent)' }}>
                   {project.icon === 'trending_up' ? '📈' : '⚙️'}
                </div>
              </div>
              <p className="project-desc">{project.description}</p>
              
              <div className="project-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tag magnetic" style={{ display: 'inline-block' }}>{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default ProjectsView;
