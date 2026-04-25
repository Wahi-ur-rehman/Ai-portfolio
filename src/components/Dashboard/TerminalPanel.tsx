import React, { useEffect, useState, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdCheck } from 'react-icons/md';

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

/* ── Boot sequence ──────────────────────────── */
const BOOT_LINES = [
  '> INITIALIZING AI_CORE v2.0.4...',
  '> SCANNING HARDWARE...',
  '> IDENTITY SCAN: [....................]',
  '> USER RECOGNIZED: WAHI',
  '> PERMISSION GRANTED: FULL_ACCESS',
  '> LOADING MODULES: [NEURAL_ENGINE] [AUTO_PIPE] [3D_GRID]',
  '> SYSTEM STATUS: ██████████ 100% ONLINE',
];

/* ── Nav commands ───────────────────────────── */
const COMMANDS: { label: string; section: Section }[] = [
  { label: './whoami.sh',     section: 'overview'    },
  { label: './projects.sh',   section: 'projects'    },
  { label: './experience.sh', section: 'experience'  },
  { label: './skills.sh',     section: 'skills'      },
];

const CMD_MAP: Record<string, Section | 'help' | 'system'> = {
  '/whoami': 'overview', '/about': 'overview',
  '/projects': 'projects',
  '/work': 'experience', '/experience': 'experience',
  '/skills': 'skills',
  '/help': 'help',
  '/system': 'system', '/status': 'system',
};

const AI_RESPONSES: Record<string, string> = {
  projects:    'I currently have 5+ projects deployed. My flagship is the Autonomous Trading Engine using ML scalping.',
  trading:     'The Trading Bot uses TensorFlow for real-time strategy optimization and MT5 API for execution.',
  automation:  'Architected 3+ n8n workflows for enterprise data processing and automated reporting.',
  skills:      'Technical Stack: Python (Automation), TensorFlow (ML), React (UX), n8n (Orchestration).',
  contact:     `Secure channels established:\n  Email   → ${portfolioData.contact.email}\n  GitHub  → github.com/Wahi-ur-rehman`,
  experience:  'Experience spans across Technical Support (1.5yr) and Hardware Commercial Relations.',
  default:     'Wahi-Core AI v2.0 Ready. Type /ask [topic] to query my systems.',
};

const TerminalPanel: React.FC<TerminalPanelProps> = ({ activeSection, setActiveSection }) => {
  const [bootLines,   setBootLines]   = useState<string[]>([]);
  const [booted,      setBooted]      = useState(false);
  const [execState,   setExecState]   = useState<ExecState>('idle');
  const [execTarget,  setExecTarget]  = useState<Section | null>(null);
  const [typedCmd,    setTypedCmd]    = useState('');
  const [log,         setLog]         = useState<LogEntry[]>([]);
  const [emailCopied, setEmailCopied] = useState(false);
  const [isTyping,    setIsTyping]    = useState(false);

  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const bootedRef  = useRef(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [log, booted, bootLines, isTyping]);

  /* Typing effect helper */
  const typeText = async (text: string, onUpdate: (current: string) => void, speed = 30) => {
    setIsTyping(true);
    let current = '';
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      onUpdate(current);
      if (text[i] !== ' ') playTypingSound();
      await new Promise(r => setTimeout(r, speed));
    }
    setIsTyping(false);
  };

  /* Boot Sequence */
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    const runBoot = async () => {
      for (const line of BOOT_LINES) {
        setBootLines(p => [...p, line]);
        playClickSound();
        await new Promise(r => setTimeout(r, 250));
      }
      setBooted(true);
    };
    runBoot();
  }, []);

  const pushLog = (e: LogEntry) => setLog(p => [...p, e]);

  const execSection = async (section: Section, label: string) => {
    if (execState === 'running') return;
    playClickSound();
    
    // Add reactive flash to background
    const bg = document.querySelector('.neural-bg');
    if (bg) {
      bg.classList.remove('flash');
      void (bg as HTMLElement).offsetWidth; // trigger reflow
      bg.classList.add('flash');
      setTimeout(() => bg.classList.remove('flash'), 400);
    }

    pushLog({ type: 'cmd', text: `$ ${label}` });
    setExecState('running');
    setExecTarget(section);
    
    setTimeout(() => {
      setActiveSection(section);
      setExecState('done');
      pushLog({ type: 'response', text: `● ACCESS_GRANTED: MODULE_LOADED` });
      setTimeout(() => { setExecState('idle'); setExecTarget(null); }, 350);
    }, 600);
  };

  const handleKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || isTyping) return;
    const raw = typedCmd.trim();
    if (!raw) return;
    setTypedCmd('');
    playEnterSound();

    if (raw.startsWith('/ask')) {
      const query = raw.slice(4).trim().toLowerCase();
      pushLog({ type: 'cmd', text: `$ ${raw}` });
      const entryIdx = log.length + 1;
      pushLog({ type: 'ai', text: '...' });
      
      const response = Object.keys(AI_RESPONSES).find(k => query.includes(k)) 
        ? AI_RESPONSES[Object.keys(AI_RESPONSES).find(k => query.includes(k))!] 
        : AI_RESPONSES.default;

      await typeText(response, (current) => {
         setLog(prev => {
            const next = [...prev];
            next[entryIdx] = { type: 'ai', text: current };
            return next;
         });
      });
      return;
    }

    const target = CMD_MAP[raw.toLowerCase()];
    if (target === 'help') {
      pushLog({ type: 'cmd', text: `$ ${raw}` });
      pushLog({ type: 'response', text: 'Commands: /whoami /projects /work /skills /system /ask [topic]' });
    } else if (target === 'system') {
      pushLog({ type: 'cmd', text: `$ ${raw}` });
      pushLog({ type: 'response', text: 'WAHI_OS v2.0.4 | KERNEL: NODE_V20 | UI: REACT_FIBER | STATUS: OPTIMAL' });
    } else if (target) {
      const cmd = COMMANDS.find(c => c.section === (target as Section));
      execSection(target as Section, cmd?.label ?? raw);
    } else {
      pushLog({ type: 'cmd', text: `$ ${raw}` });
      pushLog({ type: 'error', text: `Command not recognized. Type /help for assistance.` });
    }
  };

  return (
    <div className="terminal-panel" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header">
        <div className="window-controls">
          <span className="control close" />
          <span className="control minimize" />
          <span className="control maximize" />
        </div>
        <div className="window-title">admin@wahi-core: ~ (bash)</div>
      </div>

      <div className="terminal-content" ref={scrollRef}>
        <div className="boot-sequence">
          {bootLines.map((line, i) => (
            <div key={i} className="boot-line" style={{ color: line.includes('WAHI') ? 'var(--accent)' : 'inherit' }}>
              {line}
            </div>
          ))}
        </div>

        {booted && (
          <div className="terminal-nav animate-terminal-in">
            <p className="prompt-path">admin@wahi-core:~$&nbsp;<span className="text-muted">ls -la bin/</span></p>
            <ul className="nav-list">
              {COMMANDS.map(item => (
                <li key={item.section}>
                  <button
                    className={`nav-button magnetic ${activeSection === item.section ? 'active' : ''} ${execState === 'running' && execTarget === item.section ? 'executing' : ''}`}
                    onClick={() => execSection(item.section, item.label)}
                    disabled={execState === 'running'}
                  >
                    <span className="nav-arrow">{activeSection === item.section ? '▸' : ' '}</span>
                    <span className="nav-label">{item.label}</span>
                    {execState === 'running' && execTarget === item.section && (
                      <span className="exec-dots"><span /><span /><span /></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {booted && log.length > 0 && (
          <div className="output-log">
            {log.map((entry, i) => (
              <div key={i} className={`log-entry log-${entry.type}`}><pre>{entry.text}</pre></div>
            ))}
          </div>
        )}

        {booted && (
          <div className="terminal-input-area animate-terminal-in">
            <div className="input-line">
              <span className="prompt-symbol">❯</span>
              <input
                ref={inputRef}
                className="terminal-input"
                value={typedCmd}
                onChange={e => setTypedCmd(e.target.value)}
                onKeyDown={handleKey}
                placeholder={isTyping ? "AI is typing..." : "Type /help or ask AI..."}
                autoComplete="off"
                disabled={isTyping}
              />
              {!isTyping && <span className="input-cursor" />}
            </div>
          </div>
        )}

        {booted && (
          <div className="terminal-contact animate-terminal-in" style={{ animationDelay: '0.2s', marginTop: '1.5rem' }}>
            <div className="contact-cards">
              <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" className="contact-card github-card magnetic">
                <FaGithub className="contact-icon" /><span>GitHub</span>
              </a>
              <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" className="contact-card linkedin-card magnetic">
                <FaLinkedin className="contact-icon" /><span>LinkedIn</span>
              </a>
              <button className="contact-card email-card magnetic" onClick={() => {
                navigator.clipboard.writeText(portfolioData.contact.email);
                setEmailCopied(true);
                playClickSound();
                setTimeout(() => setEmailCopied(false), 2000);
              }}>
                {emailCopied ? <MdCheck className="contact-icon" /> : <MdEmail className="contact-icon" />}
                <span>{emailCopied ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPanel;
