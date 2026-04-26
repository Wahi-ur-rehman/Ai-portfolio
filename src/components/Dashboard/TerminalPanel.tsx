import React, { useEffect, useState, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { FaGithub, FaLinkedin, FaCalendarAlt } from 'react-icons/fa';
import { MdEmail, MdCheck, MdTerminal } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

type Section = 'overview' | 'projects' | 'experience' | 'skills';
type ExecState = 'idle' | 'running' | 'done';

interface LogEntry {
  type: 'cmd' | 'response' | 'error' | 'ai';
  text: string;
}

interface TerminalPanelProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

/* ── Sound Synth Utility ───────────────────── */
const playSound = (freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* Audio context not allowed until interaction */ }
};

const playTypingSound = () => playSound(150 + Math.random() * 100, 'sine', 0.05, 0.02);
const playClickSound = () => playSound(400, 'square', 0.1, 0.05);
const playEnterSound = () => playSound(800, 'triangle', 0.2, 0.05);

const TerminalPanel: React.FC<TerminalPanelProps> = ({ activeSection, setActiveSection }) => {
  const [booted, setBooted] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [typedCmd, setTypedCmd] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [log, isTyping]);

  const typeText = async (text: string, type: 'ai' | 'response' | 'error' = 'ai') => {
    setIsTyping(true);
    let current = '';
    const entryIdx = log.length;
    setLog(prev => [...prev, { type, text: '' }]);

    for (let i = 0; i < text.length; i++) {
        current += text[i];
        setLog(prev => {
            const next = [...prev];
            next[entryIdx] = { type, text: current };
            return next;
        });
        if (text[i] !== ' ') playTypingSound();
        await new Promise(r => setTimeout(r, 20));
    }
    setIsTyping(false);
  };

  const handleCommand = async (cmd: string) => {
    const raw = cmd.trim().toLowerCase();
    setLog(prev => [...prev, { type: 'cmd', text: `❯ ${cmd}` }]);
    playEnterSound();

    if (raw === 'ls' || raw === 'show projects') {
      await typeText(`found ${portfolioData.projects.length} artifacts:\n` + portfolioData.projects.map(p => `  - ${p.title} [${p.id}]`).join('\n'), 'response');
    } else if (raw === 'whoami' || raw === 'about') {
      await typeText(portfolioData.personalStory, 'ai');
    } else if (raw === 'clear') {
      setLog([]);
    } else if (raw === 'help') {
      await typeText('Available Commands:\n  ls         - show all projects\n  whoami     - show mission statement\n  cat resume - view academic background\n  contact    - secure communication channels\n  clear      - reset terminal\n\n  Or try: "/ask [anything about me]"', 'response');
    } else if (raw.startsWith('cat resume') || raw === 'education') {
       await typeText(`Degree: ${portfolioData.education[0].degree}\nInst: ${portfolioData.education[0].institution}\nPeriod: ${portfolioData.education[0].period}\n\n"Focusing on high-performance agentic systems."`, 'response');
    } else if (raw === 'contact') {
       await typeText(`Secure Channels Open:\n  Email    -> ${portfolioData.contact.email}\n  GitHub   -> ${portfolioData.contact.github}\n  Calendly -> ${portfolioData.contact.calendly}`, 'response');
    } else if (raw.startsWith('/ask')) {
       const q = raw.slice(4).trim();
       if (q.includes('trading')) {
         await typeText("The Autonomous Trading Engine uses a custom-trained TensorFlow model to predict micro-trends and executes trades with sub-50ms latency.", 'ai');
       } else if (q.includes('automation') || q.includes('n8n')) {
         await typeText("I architect enterprise-grade workflows that reduce manual processing time by up to 92% using agentic reasoning.", 'ai');
       } else {
         await typeText("Wahi-Core AI v2.0 ready. I am an autonomous system designed to build more autonomous systems. Ask me about my trading bots or workflow automation.", 'ai');
       }
    } else {
      await typeText(`Command "${cmd}" not recognized. Type "help" for a list of available commands.`, 'error');
    }
  };

  useEffect(() => {
    const boot = async () => {
      await new Promise(r => setTimeout(r, 500));
      setBooted(true);
      await typeText("WAHI_OS [Version 2.0.4] Initialized. Identity verified. Full system access granted.", 'response');
    };
    boot();
  }, []);

  return (
    <div className="terminal-panel" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header">
        <div className="window-controls">
          <span className="control close" />
          <span className="control minimize" />
          <span className="control maximize" />
        </div>
        <div className="window-title">admin@wahi-core: ~ (bash)</div>
        <div style={{ position: 'absolute', right: '1rem', color: 'var(--green)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
           <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', animation: 'glowPulse 2s infinite' }} />
           WAHI_AI_ONLINE
        </div>
      </div>

      <div className="terminal-content" ref={scrollRef}>
        <div className="output-log">
          {log.map((entry, i) => (
            <div key={i} className={`log-entry log-${entry.type}`}>
               <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{entry.text}</pre>
            </div>
          ))}
        </div>

        {booted && (
          <div className="terminal-input-area">
            <div className="input-line">
              <span className="prompt-symbol">❯</span>
              <input
                ref={inputRef}
                className="terminal-input"
                value={typedCmd}
                onChange={e => setTypedCmd(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !isTyping && typedCmd.trim()) {
                    handleCommand(typedCmd);
                    setTypedCmd('');
                  }
                }}
                placeholder={isTyping ? "..." : "Type help..."}
                autoComplete="off"
                disabled={isTyping}
              />
              {!isTyping && <span className="input-cursor" />}
            </div>
          </div>
        )}

        {booted && !isTyping && (
          <motion.div 
            className="terminal-contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
             <div className="contact-cards">
               <a href={portfolioData.contact.calendly} target="_blank" rel="noreferrer" className="contact-card magnetic" style={{ borderColor: 'var(--accent)', background: 'var(--accent-dim)' }}>
                 <FaCalendarAlt className="contact-icon" style={{ color: 'var(--accent)' }} />
                 <span style={{ color: '#fff' }}>Book 15-min Call</span>
               </a>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" className="contact-card magnetic">
                    <FaGithub className="contact-icon" /><span>GitHub</span>
                  </a>
                  <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" className="contact-card magnetic">
                    <FaLinkedin className="contact-icon" /><span>LinkedIn</span>
                  </a>
               </div>
               <button className="contact-card magnetic" onClick={() => {
                 navigator.clipboard.writeText(portfolioData.contact.email);
                 setEmailCopied(true);
                 setTimeout(() => setEmailCopied(false), 2000);
               }}>
                 {emailCopied ? <MdCheck className="contact-icon" style={{ color: 'var(--green)' }} /> : <MdEmail className="contact-icon" />}
                 <span>{emailCopied ? 'Copied Email!' : 'Copy Email'}</span>
               </button>
             </div>
          </motion.div>
        )}
      </div>
      
      <div style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border)', fontSize: '0.6rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
         <span>System: Node_v20. Neural_Engine: Stable.</span>
         <span>Press [~] to Focus</span>
      </div>
    </div>
  );
};

export default TerminalPanel;
