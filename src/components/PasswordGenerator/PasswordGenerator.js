import React, { useCallback, useState } from 'react';

const CHARACTER_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'il1Lo0O',
  ambiguous: '{}[]()/\\\'"`~,;.<>'
};

const DEFAULT_OPTIONS = {
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false
};

const PRESETS = [
  { name: 'secure / 16', length: 16, options: { ...DEFAULT_OPTIONS, excludeSimilar: true } },
  { name: 'pin / 4', length: 4, options: { ...DEFAULT_OPTIONS, lowercase: false, uppercase: false, symbols: false } },
  { name: 'alphanumeric / 12', length: 12, options: { ...DEFAULT_OPTIONS, symbols: false } },
  { name: 'maximum / 20', length: 20, options: { ...DEFAULT_OPTIONS, excludeSimilar: true, excludeAmbiguous: true } }
];

const calculateStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && [...password].some(char => CHARACTER_SETS.symbols.includes(char))) score += 1;
  return Math.min(score, 5);
};

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (options.lowercase) charset += CHARACTER_SETS.lowercase;
    if (options.uppercase) charset += CHARACTER_SETS.uppercase;
    if (options.numbers) charset += CHARACTER_SETS.numbers;
    if (options.symbols) charset += CHARACTER_SETS.symbols;
    if (options.excludeSimilar) charset = [...charset].filter(char => !CHARACTER_SETS.similar.includes(char)).join('');
    if (options.excludeAmbiguous) charset = [...charset].filter(char => !CHARACTER_SETS.ambiguous.includes(char)).join('');

    if (!charset) {
      setPassword('');
      setStrength(0);
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    const nextPassword = [...randomValues].map(value => charset[value % charset.length]).join('');
    setPassword(nextPassword);
    setStrength(calculateStrength(nextPassword));
    setCopied(false);
  }, [length, options]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (option) => {
    setOptions(current => ({ ...current, [option]: !current[option] }));
  };

  const applyPreset = (preset) => {
    setLength(preset.length);
    setOptions(preset.options);
    setPassword('');
    setStrength(0);
  };

  const strengthLabels = ['empty', 'very weak', 'weak', 'fair', 'good', 'strong'];

  return (
    <section className="tui-tool password-generator">
      <div className="tui-tool-titlebar">
        <strong>/password-generator</strong>
        <span>window.crypto · local only</span>
      </div>
      <div className="password-header">
        <h3>Password generator</h3>
        <p>Generate cryptographically random passwords in this browser.</p>
      </div>

      <div className="password-output">
        <div className="password-display">
          <input type="text" value={password} readOnly placeholder="generated value" className="password-field" />
          <button type="button" onClick={copyToClipboard} disabled={!password} className={`copy-btn ${copied ? 'copied' : ''}`}>
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
        {password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div className={`strength-fill strength-${strength}`} style={{ width: `${(strength / 5) * 100}%` }} />
            </div>
            <span className={`strength-label strength-${strength}`}>{strengthLabels[strength]}</span>
          </div>
        )}
      </div>

      <div className="password-controls">
        <div className="length-control">
          <label htmlFor="password-length">length <span className="length-value">{length}</span></label>
          <input id="password-length" type="range" min="4" max="50" value={length} onChange={event => setLength(Number(event.target.value))} className="length-slider" />
          <div className="length-labels"><span>04</span><span>50</span></div>
        </div>

        <div className="options-grid">
          {[
            ['lowercase', 'lowercase (a-z)'],
            ['uppercase', 'uppercase (A-Z)'],
            ['numbers', 'numbers (0-9)'],
            ['symbols', 'symbols (!@#$…)'],
            ['excludeSimilar', 'exclude similar'],
            ['excludeAmbiguous', 'exclude ambiguous']
          ].map(([option, label]) => (
            <label className="option-item" key={option}>
              <input type="checkbox" checked={options[option]} onChange={() => toggleOption(option)} />
              <span aria-hidden="true" className="checkmark" />
              {label}
            </label>
          ))}
        </div>

        <div className="action-buttons">
          <button type="button" onClick={generatePassword} className="generate-btn">Generate password</button>
          <button type="button" onClick={() => { setPassword(''); setStrength(0); }} className="clear-btn">Clear</button>
        </div>
      </div>

      <div className="presets-section">
        <h4>Presets</h4>
        <div className="preset-buttons">
          {PRESETS.map(preset => (
            <button type="button" key={preset.name} onClick={() => applyPreset(preset)} className="preset-btn">
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PasswordGenerator;
