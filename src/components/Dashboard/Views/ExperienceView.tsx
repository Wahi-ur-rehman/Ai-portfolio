import React from 'react';
import { portfolioData } from '../../../data/portfolioData';

const ExperienceView: React.FC = () => {
  return (
    <div className="view-container animate-fade-in">
      <h1 className="view-title">Timeline</h1>
      
      <div className="timeline-grid">
        <div className="timeline-section">
          <h2 className="section-subtitle">Experience</h2>
          <div className="timeline">
            {portfolioData.experience.map(exp => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-period">{exp.period}</span>
                  <h3 className="timeline-title">{exp.title}</h3>
                  <h4 className="timeline-company">{exp.company}</h4>
                  <p className="timeline-desc">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="timeline-section">
          <h2 className="section-subtitle">Education</h2>
          <div className="timeline">
            {portfolioData.education.map(edu => (
              <div key={edu.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-period">{edu.period}</span>
                  <h3 className="timeline-title">{edu.degree}</h3>
                  <h4 className="timeline-company">{edu.institution}</h4>
                  <p className="timeline-desc">{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceView;
