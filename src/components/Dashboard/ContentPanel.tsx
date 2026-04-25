import React from 'react';
import OverviewView from './Views/OverviewView';
import ProjectsView from './Views/ProjectsView';
import ExperienceView from './Views/ExperienceView';
import SkillsView from './Views/SkillsView';

interface ContentPanelProps {
  activeSection: string;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ activeSection }) => {
  return (
    <div className="content-panel">
      <div className="content-view-wrapper">
        <section id="overview" className={`section-container ${activeSection === 'overview' ? 'active-ref' : ''}`}>
          <div className="stagger-item stagger-1">
            <OverviewView />
          </div>
        </section>
        
        <section id="projects" className={`section-container ${activeSection === 'projects' ? 'active-ref' : ''}`}>
          <div className="stagger-item stagger-1">
            <ProjectsView />
          </div>
        </section>
        
        <section id="experience" className={`section-container ${activeSection === 'experience' ? 'active-ref' : ''}`}>
          <div className="stagger-item stagger-1">
            <ExperienceView />
          </div>
        </section>
        
        <section id="skills" className={`section-container ${activeSection === 'skills' ? 'active-ref' : ''}`}>
          <div className="stagger-item stagger-1">
            <SkillsView />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContentPanel;
