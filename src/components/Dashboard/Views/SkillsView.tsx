import React from 'react';
import { portfolioData } from '../../../data/portfolioData';

const SkillsView: React.FC = () => {
  return (
    <div className="view-container animate-fade-in">
      <h1 className="view-title">Technical Skills</h1>
      
      <div className="skills-grid">
        {portfolioData.skills.map((skillGroup, idx) => (
          <div key={idx} className="skill-group-card">
            <h3 className="skill-group-title">{skillGroup.category}</h3>
            <div className="skill-tags">
              {skillGroup.items.map((skill, sIdx) => (
                <span key={sIdx} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsView;
