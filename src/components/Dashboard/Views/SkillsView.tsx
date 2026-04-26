import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../../../data/portfolioData';
import { FaPython, FaReact, FaDatabase, FaBrain, FaCogs, FaProjectDiagram } from 'react-icons/fa';
import { SiTensorflow, SiN8N, SiTypescript, SiFigma } from 'react-icons/si';

const iconMap: any = {
  "Artificial Intelligence": <FaBrain />,
  "Development & Ops": <FaCogs />,
  "Credibility": <FaProjectDiagram />,
  "Python": <FaPython />,
  "React": <FaReact />,
  "TensorFlow": <SiTensorflow />,
  "n8n": <SiN8N />,
  "TypeScript": <SiTypescript />,
  "Figma": <SiFigma />,
  "Data": <FaDatabase />
};

const SkillsView: React.FC = () => {
  return (
    <div className="view-container">
      <h1 className="view-title">Capability Matrix</h1>
      
      <div className="skills-grid">
        {portfolioData.skills.map((skillGroup, idx) => (
          <motion.div 
            key={idx} 
            className="skill-group-card depth-hover"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
               <div style={{ color: 'var(--accent-ai)', fontSize: '1.2rem' }}>
                  {iconMap[skillGroup.category] || <FaCogs />}
               </div>
               <h3 className="skill-group-title" style={{ margin: 0 }}>{skillGroup.category}</h3>
            </div>
            
            <div className="skill-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {skillGroup.items.map((skill, sIdx) => (
                <div key={sIdx} className="skill-item-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <div style={{ marginTop: '6px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span className="skill-proof" style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="section-label">System Architecture Expertise</div>
      <div style={{ 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--r-lg)', 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '2rem',
        textAlign: 'center'
      }}>
         <div className="magnetic">
            <SiTensorflow size={40} color="#FF6F00" style={{ marginBottom: '1rem' }} />
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>TENSORFLOW</div>
         </div>
         <div className="magnetic">
            <SiN8N size={40} color="#FF6D5A" style={{ marginBottom: '1rem' }} />
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>N8N.IO</div>
         </div>
         <div className="magnetic">
            <FaPython size={40} color="#3776AB" style={{ marginBottom: '1rem' }} />
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>PYTHON 3</div>
         </div>
         <div className="magnetic">
            <SiTypescript size={40} color="#3178C6" style={{ marginBottom: '1rem' }} />
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>TYPESCRIPT</div>
         </div>
      </div>
    </div>
  );
};

export default SkillsView;
