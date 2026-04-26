import React from 'react';
import OverviewView from './Views/OverviewView';
import ProjectsView from './Views/ProjectsView';
import ExperienceView from './Views/ExperienceView';
import SkillsView from './Views/SkillsView';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentPanelProps {
  activeSection: string;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ activeSection }) => {
  return (
    <div className="content-panel">
      <div className="content-view-wrapper">
        <section id="overview" className="section-container">
           <OverviewView />
        </section>
        
        <section id="projects" className="section-container">
           <ProjectsView />
        </section>
        
        <section id="experience" className="section-container">
           <ExperienceView />
        </section>
        
        <section id="skills" className="section-container">
           <SkillsView />
        </section>
      </div>
    </div>
  );
};

export default ContentPanel;
