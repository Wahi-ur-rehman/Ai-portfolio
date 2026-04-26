import React from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../../../data/portfolioData';
import { FaGraduationCap, FaBriefcase, FaCertificate, FaGithubAlt } from 'react-icons/fa';

const ExperienceView: React.FC = () => {
  return (
    <div className="view-container">
      <h1 className="view-title">System Evolution</h1>
      
      <div className="section-label">Interactive Timeline</div>
      <div style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        gap: '2rem', 
        padding: '2rem 1rem', 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}>
        {[...portfolioData.experience, ...portfolioData.education].map((item: any, i) => (
          <motion.div
            key={item.id}
            className="focus-card depth-hover"
            style={{ minWidth: '300px', flexShrink: 0 }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="timeline-period" style={{ margin: 0 }}>{item.period}</span>
              {item.degree ? <FaGraduationCap color="var(--accent)" /> : <FaBriefcase color="var(--accent-ai)" />}
            </div>
            <h3 className="timeline-title" style={{ fontSize: '1.2rem' }}>{item.title || item.degree}</h3>
            <h4 className="timeline-company" style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--accent)' }}>{item.company || item.institution}</h4>
            <p className="timeline-desc" style={{ fontSize: '0.8rem' }}>{item.description}</p>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
               {item.degree ? 'RANK: SCHOLAR' : 'ROLE: TECH LEAD'}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="section-label">Credibility Layer [Proof]</div>
      <div className="snapshot-grid">
        <div className="snapshot-group depth-hover">
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <FaCertificate color="var(--amber)" fontSize="1.2rem" />
              <span className="snapshot-label" style={{ margin: 0 }}>Certifications</span>
           </div>
           <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
             <li style={{ marginBottom: '0.5rem' }}>• TensorFlow Developer Certificate</li>
             <li style={{ marginBottom: '0.5rem' }}>• Automation Architect (n8n)</li>
             <li>• Full-Stack DX Specialist</li>
           </ul>
        </div>

        <div className="snapshot-group depth-hover">
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <FaGithubAlt color="var(--text)" fontSize="1.2rem" />
              <span className="snapshot-label" style={{ margin: 0 }}>Open Source</span>
           </div>
           <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.5rem' }}>500+</div>
           <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Contributions to local AI communities and automation frameworks.</p>
        </div>

        <div className="snapshot-group depth-hover">
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--green)', borderRadius: '50%' }} />
              <span className="snapshot-label" style={{ margin: 0 }}>Verification</span>
           </div>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>"Wahi is among the top 1% of students bridging hardware relations with AI software."</p>
           <p style={{ fontSize: '0.65rem', color: 'var(--accent)', marginTop: '0.5rem' }}>— Academic Supervisor</p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceView;
