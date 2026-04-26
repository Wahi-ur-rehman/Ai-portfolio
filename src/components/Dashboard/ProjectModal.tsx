import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { FaGithub, FaExternalLinkAlt, FaPlay } from 'react-icons/fa';

interface ProjectModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose}>
              <MdClose size={24} />
            </button>

            <div className="modal-body">
              <div className="case-study-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <span>CASE STUDY</span>
                  <div style={{ height: '1px', width: '40px', background: 'var(--accent)' }} />
                  <span>{project.id.toUpperCase()}</span>
                </div>
                <h2 className="case-study-title">{project.title}</h2>
                <p className="case-study-desc">{project.fullDescription || project.description}</p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                   {project.links.github !== "#" && (
                     <a href={project.links.github} target="_blank" rel="noreferrer" className="action-btn primary magnetic">
                       <FaGithub style={{ marginRight: '8px' }} /> View Code
                     </a>
                   )}
                   {project.links.demo !== "#" && (
                     <a href={project.links.demo} target="_blank" rel="noreferrer" className="action-btn primary magnetic" style={{ background: 'var(--green)', color: '#000', borderColor: 'var(--green)' }}>
                       <FaExternalLinkAlt style={{ marginRight: '8px' }} /> Live Demo
                     </a>
                   )}
                   {project.links.video !== "#" && (
                     <a href={project.links.video} target="_blank" rel="noreferrer" className="action-btn magnetic">
                       <FaPlay style={{ marginRight: '8px' }} /> Watch Proof
                     </a>
                   )}
                </div>
              </div>

              <div className="metrics-row">
                {project.metrics && Object.entries(project.metrics).map(([label, value], i) => (
                  <div key={i} className="metric-box hover-glow">
                    <span className="metric-value">{value as string}</span>
                    <span className="metric-label">{label}</span>
                  </div>
                ))}
              </div>

              <div className="detail-grid">
                <div className="detail-section">
                  <h4>The Problem</h4>
                  <p>{project.problem || "Information not specified."}</p>
                </div>
                <div className="detail-section">
                  <h4>The Solution</h4>
                  <p>{project.solution || "Information not specified."}</p>
                </div>
              </div>

              <div style={{ marginTop: '3rem' }}>
                <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>SYSTEM FLOW</h4>
                <div style={{ height: '200px', background: 'var(--bg-card)', border: '1px dashed var(--border)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                   <div style={{ margin: 'auto', textAlign: 'center' }}>
                      <p>[REACTIVE ARCHITECTURE DIAGRAM]</p>
                      <p style={{ fontSize: '0.7rem' }}>Input → Processing (ML Core) → MT5 API Output</p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
