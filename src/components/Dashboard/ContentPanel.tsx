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
      {/* key change forces re-mount → re-triggers CSS animation */}
      <div key={activeSection} className="content-view-wrapper animate-slide-in">
        {activeSection === 'overview' && <OverviewView />}
        {activeSection === 'projects' && <ProjectsView />}
        {activeSection === 'experience' && <ExperienceView />}
        {activeSection === 'skills' && <SkillsView />}
      </div>
    </div>
  );
};

export default ContentPanel;
