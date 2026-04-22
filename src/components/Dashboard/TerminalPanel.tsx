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

/* ── Boot sequence ──────────────────────────── */
const BOOT_LINES = [
  '> Initializing AI-Core v1.0...',
  '> Authenticating: Wahi-ur-Rehman...',
  '> Loading modules: [AI] [Auto] [3D]',
  '> System status: ████████ ONLINE',
  '> Access Granted. Welcome.',
];

/* ── Nav commands ───────────────────────────── */
const COMMANDS: { label: string; section: Section }[] = [
  { label: './overview.sh',   section: 'overview'    },
  { label: './projects.sh',   section: 'projects'    },
  { label: './experience.sh', section: 'experience'  },
  { label: './skills.sh',     section: 'skills'      },
];

/* ── Typed-command routing ──────────────────── */
const CMD_MAP: Record<string, Section | 'help' | 'system'> = {
  '/whoami': 'overview', '/about': 'overview',
  '/projects': 'projects',
  '/work': 'experience', '/experience': 'experience',
  '/skills': 'skills',
  '/help': 'help',
  '/system': 'system', '/status': 'system',
};

/* ── AI assistant responses ─────────────────── */
const AI_RESPONSES: Record<string, string> = {
  projects:    'Active projects:\n  → AI Trading Bot  — ML scalping + risk management\n  → Automation Workflows — n8n pipelines & API integrations\nType /projects to view details.',
  trading:     'AI Trading Bot uses scikit-learn for ML-based scalping with real-time MT5 data and automated risk controls.',
  automation:  'Automation Workflows: n8n pipelines, email automation, Zapier-style API integrations for real-world tasks.',
  skills:      'Core: Python · TensorFlow · React\nDomain: ML · Automation · 3D\nType /skills for the full breakdown.',
  contact:     `Email   → ${portfolioData.contact.email}\nGitHub  → github.com/Wahi-ur-rehman\nLinkedIn → linkedin.com/in/wahi-abbasi`,
  experience:  'Experience: Call Center Rep (1.5yr) · Sales · Teaching\nEducation: B.Sc AI @ SZABIST Islamabad (Exp. 2028)',
  education:   "Pursuing Bachelor's in AI at SZABIST Islamabad — Expected graduation 2028.",
  default:     'Wahi-Core AI v1.0\nUsage: /ask [topic]\nTopics: projects · skills · trading · automation · contact · experience',
};

const getAIResponse = (q: string) => {
  const lower = q.toLowerCase();
  for (const key of Object.keys(AI_RESPONSES)) {
    if (lower.includes(key)) return AI_RESPONSES[key];
  }
  return AI_RESPONSES.default;
};

const HELP_TEXT  = 'Nav: /whoami  /projects  /work  /skills  /status\nAI:  /ask [anything about Wahi]';
const SYS_TEXT   = 'AI-Core v1.0  |  User: Wahi-ur-Rehman  |  ● ONLINE\nModules: AI · Automation · 3D  |  Build: 2026.04';

/* ═══════════════════════════════════════════════════════ */
const TerminalPanel: React.FC<TerminalPanelProps> = ({ activeSection, setActiveSection }) => {
  const [bootLines,   setBootLines]   = useState<string[]>([]);
  const [booted,      setBooted]      = useState(false);
  const [execState,   setExecState]   = useState<ExecState>('idle');
  const [execTarget,  setExecTarget]  = useState<Section | null>(null);
  const [typedCmd,    setTypedCmd]    = useState('');
  const [log,         setLog]         = useState<LogEntry[]>([]);
  const [emailCopied, setEmailCopied] = useState(false);

  const bootedRef  = useRef(false);
  const inputRef   = useRef<HTMLInputElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  /* auto-scroll */
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [log, booted, execState]);

  /* boot sequence (ref-guarded against StrictMode double-run) */
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    let i = 0;
    const tick = () => {
      if (i < BOOT_LINES.length) {
        setBootLines(p => [...p, BOOT_LINES[i++]]);
        setTimeout(tick, 380);
      } else {
        setTimeout(() => setBooted(true), 250);
      }
    };
    setTimeout(tick, 300);
  }, []);

  const pushLog = (e: LogEntry) => setLog(p => [...p, e]);

  /* execute a section switch with animation */
  const execSection = (section: Section, label: string) => {
    if (execState === 'running') return;
    pushLog({ type: 'cmd',      text: `$ ${label}` });
    setExecState('running');
    setExecTarget(section);
    setTimeout(() => {
      setActiveSection(section);
      setExecState('done');
      pushLog({ type: 'response', text: `● Loaded: ${label.replace('./', '').replace('.sh', '')}` });
      setTimeout(() => { setExecState('idle'); setExecTarget(null); }, 350);
    }, 480);
  };

  /* handle typed commands */
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const raw = typedCmd.trim().toLowerCase();
    if (!raw) return;
    setTypedCmd('');

    /* /ask AI mode */
    if (raw.startsWith('/ask')) {
      const query = raw.slice(4).trim();
      pushLog({ type: 'cmd', text: `$ ${raw}` });
      pushLog({ type: 'ai',  text: '⠋ Processing...' });
      setTimeout(() => {
        setLog(prev => {
          const next = [...prev];
          next[next.length - 1] = { type: 'ai', text: getAIResponse(query) };
          return next;
        });
      }, 580);
      return;
    }

    const target = CMD_MAP[raw];
    if (target === 'help') {
      pushLog({ type: 'cmd', text: `$ ${raw}` });
      pushLog({ type: 'response', text: HELP_TEXT });
    } else if (target === 'system') {
      pushLog({ type: 'cmd', text: `$ ${raw}` });
      pushLog({ type: 'response', text: SYS_TEXT });
    } else if (target) {
      const cmd = COMMANDS.find(c => c.section === (target as Section));
      execSection(target as Section, cmd?.label ?? raw);
    } else {
      pushLog({ type: 'cmd',   text: `$ ${raw}` });
      pushLog({ type: 'error', text: `bash: ${raw}: not found. Try /help` });
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.contact.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="terminal-panel" onClick={() => inputRef.current?.focus()}>

      {/* macOS header */}
      <div className="terminal-header">
        <div className="window-controls">
          <span className="control close" />
          <span className="control minimize" />
          <span className="control maximize" />
        </div>
        <div className="window-title">bash — admin@wahi-core: ~</div>
      </div>

      <div className="terminal-content" ref={scrollRef}>

        {/* Boot */}
        <div className="boot-sequence">
          {bootLines.map((line, i) => (
            <div key={i} className="boot-line">{line}</div>
          ))}
        </div>

        {/* Navigation */}
        {booted && (
          <div className="terminal-nav animate-terminal-in">
            <p className="prompt-path">
              admin@wahi-core:~$&nbsp;<span className="text-muted">ls -la modules/</span>
            </p>
            <ul className="nav-list">
              {COMMANDS.map(item => (
                <li key={item.section}>
                  <button
                    className={[
                      'nav-button',
                      activeSection === item.section ? 'active' : '',
                      execState === 'running' && execTarget === item.section ? 'executing' : '',
                    ].join(' ')}
                    onClick={() => execSection(item.section, item.label)}
                    disabled={execState === 'running'}
                  >
                    <span className="nav-arrow">
                      {activeSection === item.section ? '▸' : ' '}
                    </span>
                    <span className="nav-label">{item.label}</span>
                    {execState === 'running' && execTarget === item.section && (
                      <span className="exec-dots">
                        <span /><span /><span />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Output log */}
        {booted && log.length > 0 && (
          <div className="output-log">
            {log.map((entry, i) => (
              <div key={i} className={`log-entry log-${entry.type}`}>
                <pre>{entry.text}</pre>
              </div>
            ))}
          </div>
        )}

        {/* Command input */}
        {booted && (
          <div className="terminal-input-area animate-terminal-in"
            style={{ animationDelay: '0.1s' }}>
            <div className="input-line">
              <span className="prompt-symbol">❯</span>
              <input
                ref={inputRef}
                className="terminal-input"
                value={typedCmd}
                onChange={e => setTypedCmd(e.target.value)}
                onKeyDown={handleKey}
                placeholder="/help  or  /ask anything"
                autoComplete="off"
                spellCheck={false}
              />
              <span className="input-cursor" />
            </div>
          </div>
        )}

        {/* Contact */}
        {booted && (
          <div className="terminal-contact animate-terminal-in"
            style={{ animationDelay: '0.2s' }}>
            <p className="prompt-path">
              admin@wahi-core:~$&nbsp;<span className="text-muted">cat contact.txt</span>
            </p>
            <div className="contact-cards">
              <a href={portfolioData.contact.github} target="_blank" rel="noreferrer"
                className="contact-card github-card">
                <FaGithub className="contact-icon" /><span>GitHub</span>
              </a>
              <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer"
                className="contact-card linkedin-card">
                <FaLinkedin className="contact-icon" /><span>LinkedIn</span>
              </a>
              <button className="contact-card email-card" onClick={copyEmail}>
                {emailCopied
                  ? <MdCheck className="contact-icon" />
                  : <MdEmail className="contact-icon" />}
                <span>{emailCopied ? '✓ Copied!' : 'Copy Email'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TerminalPanel;
